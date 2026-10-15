import { mobileLayout } from './responsive.js';
import { setupObjectSwipe } from './mobile-enhancements.js?v=3';
import { createMedia } from './media.js?v=22';
import { createMediaHeading } from './media-heading.js';

export function createSlideshow(items, interval, scrollRoot, interactive = false) {
  const element = document.createElement('div');
  element.className = `photowall-slideshow${interactive ? ' photowall-model' : ''}`;
  const surface = document.createElement('div');
  surface.className = 'photowall-slide';
  const figures = items.map(createMedia);
  figures.forEach(figure => { figure.querySelector('img').draggable = false; });
  surface.append(figures[0]);
  element.append(surface);
  if (interactive && mobileLayout.matches) {
    const hint = document.createElement('p'); hint.className = 'mobile-object-hint';
    hint.textContent = 'Двигайте пальцем по объекту, чтобы повернуть ↔'; element.append(hint);
  }
  element.title = interactive ? (mobileLayout.matches ? 'Проведите влево или вправо, чтобы повернуть' : 'Поводи мышью · стрелки ← → меняют ракурс') : 'Стрелки ← → меняют фотографию';
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer = 0, visible = false, disposed = false, busy = false;
  let pointerActive = false, requestedIndex = 0, requestId = 0;
  let autoplayDirection = 1;
  const decoded = new Map();
  function prepare(i) {
    if (!decoded.has(i)) {
      const image = figures[i].querySelector('img');
      image.loading = 'eager';
      decoded.set(i, image.decode().then(() => true, () => false));
    }
    return decoded.get(i);
  }
  const allowed = () => visible && !disposed && !document.hidden && !document.documentElement.hasAttribute('data-viewer-open');
  function schedule() {
    clearTimeout(timer);
    if (allowed() && !reduced.matches && !busy && !pointerActive) {
      const direction = interactive ? autoplayDirection : 1;
      prepare((index + direction + items.length) % items.length);
      timer = setTimeout(() => change(direction, true), interval);
    }
  }
  async function select(next, automatic = false) {
    if (disposed) return;
    clearTimeout(timer);
    busy = true;
    requestedIndex = next;
    const request = ++requestId;
    const ready = await prepare(next);
    // A fast sweep must show the latest pointer position, even if decoding finishes out of order.
    if (disposed || request !== requestId) return;
    if (ready && (!automatic || (allowed() && !reduced.matches && !pointerActive))) {
      const focused = surface.contains(document.activeElement);
      surface.replaceChildren(figures[next]);
      index = next;
      if (interactive) {
        if (index === items.length - 1) autoplayDirection = -1;
        else if (index === 0) autoplayDirection = 1;
      }
      if (focused) figures[next].querySelector('img').focus({ preventScroll: true });
    }
    busy = false;
    schedule();
  }
  function change(direction, automatic = false) {
    return select((index + direction + items.length) % items.length, automatic);
  }
  element.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    change(event.key === 'ArrowLeft' ? -1 : 1);
  }, { signal: abort.signal });

  // A damped spring gives the model the same light, physical response as the badges.
  let raf = 0, previous = 0, x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0;
  const clamp = value => Math.max(-1, Math.min(1, value));
  function animate(now) {
    raf = 0;
    if (!allowed() || reduced.matches) return;
    const dt = previous ? Math.min((now - previous) / 1000, .032) : 1 / 60;
    previous = now;
    vx += ((tx - x) * 65 - vx * 9) * dt;
    vy += ((ty - y) * 65 - vy * 9) * dt;
    x += vx * dt; y += vy * dt;
    surface.style.transform = `perspective(1100px) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${y * .12}deg)`;
    if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > .015) raf = requestAnimationFrame(animate);
    else previous = 0;
  }
  function startMotion() {
    if (interactive && allowed() && !reduced.matches && !raf) raf = requestAnimationFrame(animate);
  }
  function followPointer(event) {
    if (!interactive || mobileLayout.matches || event.pointerType === 'touch') return;
    const rect = element.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const next = Math.min(items.length - 1, Math.floor(position * items.length));
    const entering = !pointerActive;
    pointerActive = true;
    clearTimeout(timer);
    if (entering || next !== requestedIndex) select(next);
    if (reduced.matches) return;
    tx = -clamp((event.clientY - rect.top) / rect.height * 2 - 1) * 5;
    ty = clamp((event.clientX - rect.left) / rect.width * 2 - 1) * 7;
    startMotion();
  }
  element.addEventListener('pointerenter', followPointer, { passive: true, signal: abort.signal });
  element.addEventListener('pointermove', followPointer, { passive: true, signal: abort.signal });
  element.addEventListener('pointerleave', () => {
    if (mobileLayout.matches) return;
    pointerActive = false; tx = ty = 0; startMotion(); schedule();
  }, { signal: abort.signal });
  let swipeStartX = 0, swipeStartY = 0, swipeBounds;
  const stopSwipe = interactive ? setupObjectSwipe(surface, {
    start(event) {
      swipeBounds = surface.getBoundingClientRect();
      swipeStartX = event.clientX; swipeStartY = event.clientY;
      pointerActive = true; requestedIndex = index; ++requestId; busy = false; clearTimeout(timer);
    },
    move(delta, motion) {
      // Use the same left/centre/right view zones as the desktop pointer.
      // Show one decoded view at a time: blending renders doubled lettering.
      const px = Math.max(0, Math.min(1, (swipeStartX + motion.dx - swipeBounds.left) / swipeBounds.width));
      const py = (swipeStartY + motion.dy - swipeBounds.top) / swipeBounds.height;
      const next = Math.min(items.length - 1, Math.floor(px * items.length));
      if (next !== requestedIndex) select(next);
      tx = -clamp(py * 2 - 1) * 5;
      ty = clamp(px * 2 - 1) * 7;
      startMotion();
    },
    end() { pointerActive = false; tx = ty = 0; startMotion(); schedule(); },
  }) : () => {};
  function sync() {
    schedule();
    if (!allowed() || reduced.matches) {
      cancelAnimationFrame(raf); raf = previous = 0;
      x = y = vx = vy = tx = ty = 0;
      surface.style.transform = '';
    }
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && interactive) items.forEach((_, i) => prepare(i));
    sync();
  }, { root: scrollRoot, rootMargin: '160px', threshold: 0 });
  observer.observe(element);
  document.addEventListener('visibilitychange', sync, { signal: abort.signal });
  document.addEventListener('portfolio-viewer-change', sync, { signal: abort.signal });
  reduced.addEventListener('change', sync, { signal: abort.signal });
  return { element, change, dispose() {
    disposed = true; stopSwipe(); clearTimeout(timer); cancelAnimationFrame(raf); observer.disconnect(); abort.abort(); decoded.clear();
  } };
}

export function createPhotowall(data, scrollRoot) {
  const element = document.createElement('section');
  element.className = 'photowall-content';
  element.setAttribute('aria-label', 'Фотозона / модель и реализация');
  const model = createSlideshow(data.media.slice(0, 3), 1000, scrollRoot, true);
  const photos = createSlideshow(data.media.slice(4), 2000, scrollRoot);
  const heading = document.createElement('p');
  heading.className = 'media-heading';
  heading.textContent = 'Фотозона / 3D-модель и реализация';
  element.append(heading, model.element, createMediaHeading('Фотозона в жизни'), createMedia(data.media[3]), photos.element);
  return { element, dispose() { model.dispose(); photos.dispose(); } };
}
