import { mobileLayout } from './responsive.js';
import { imageSource } from './mobile-media.js';
import { ClothPoster } from './cloth-renderer.js?v=5';

// The intro reserves its place in the gallery; a viewport layer lets the cloth
// extend beyond the media column without intercepting its transparent area.
export function createPosterIntro(project, scrollRoot) {
  const element = document.createElement('section');
  element.className = 'poster-intro';
  element.setAttribute('aria-label', `Обложка проекта ${project.title}`);
  const canvas = document.createElement('canvas');
  canvas.className = 'poster-canvas';
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `Плакат ${project.title}. ${mobileLayout.matches ? 'Потяни пальцем' : 'Потяни мышью'}; стрелки — движение, пробел — толчок, R — вернуть в центр.`);
  const hit = document.createElement('div');
  hit.className = 'poster-hit';
  hit.setAttribute('aria-hidden', 'true');
  const fallback = document.createElement('img');
  fallback.className = 'poster-fallback';
  fallback.src = project.poster.src;
  fallback.alt = `Обложка проекта ${project.title}`;
  fallback.hidden = true;
  const hint = document.createElement('p');
  hint.className = 'poster-hint';
  hint.textContent = 'Потяни плакат · ниже — проект ↓';
  const layer = document.createElement('div');
  layer.className = 'poster-viewport';
  layer.hidden = true;
  layer.append(canvas, hit);
  // Draw across the viewport so a dragged sheet is never cropped by its section.
  // The anchor follows the section 1:1 on scroll, including on mobile (no parallax).
  // Mobile uses an oversized page layer: native scrolling moves the entire canvas,
  // without a JS scroll follower, while the cloth can extend outside its section.
  (mobileLayout.matches ? element : document.body).append(layer);
  element.append(fallback, hint);
  let cloth;
  let visible = false;
  const abort = new AbortController();
  let dragging = false;
  let geometryFrame = 0;
  const sync = () => {
    const active = (visible || dragging) && !document.hidden && !document.documentElement.hasAttribute('data-viewer-open');
    // On mobile retain the painted surface when it leaves the viewport;
    // visibility changes should pause physics, not remove the scroll layer.
    layer.hidden = mobileLayout.matches ? false : !active;
    cloth?.setActive(active);
  };
  const updatePosition = () => {
    if (geometryFrame) return;
    geometryFrame = requestAnimationFrame(() => {
      geometryFrame = 0;
      cloth?.updateAnchor();
      cloth?.request();
    });
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { root: scrollRoot, rootMargin: mobileLayout.matches ? '100% 0px' : '0px', threshold: 0 });
  try {
    cloth = new ClothPoster(canvas, hit, fallback, element, { mobile: mobileLayout.matches });
    cloth.onDrag = active => { dragging = active; };
    cloth.setSource({ ...project.poster, src: imageSource(project.poster.src) }, project.id);
    if (!mobileLayout.matches) (scrollRoot || window).addEventListener('scroll', updatePosition, { passive: true, signal: abort.signal });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      hit.addEventListener(event, sync, { signal: abort.signal });
    }
    observer.observe(element);
    document.addEventListener('portfolio-viewer-change', sync, { signal: abort.signal });
    document.addEventListener('visibilitychange', sync, { signal: abort.signal });
  } catch {
    canvas.hidden = true;
    hit.hidden = true;
    fallback.hidden = false;
    hint.textContent = 'Ниже — проект ↓';
  }
  return { element, dispose() { abort.abort(); cancelAnimationFrame(geometryFrame); observer.disconnect(); cloth?.dispose(); layer.remove(); } };
}
