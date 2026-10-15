import { createMedia } from './media.js?v=22';

export function createImageMarquee(items, label = 'Advertalyze — отпускные креативы. Прокрутка влево и вправо') {
  const element = document.createElement('section');
  element.className = 'image-marquee';
  element.setAttribute('aria-label', label);
  element.tabIndex = 0;
  const track = document.createElement('div');
  track.className = 'image-marquee-track';
  for (let copy = 0; copy < 2; copy++) {
    const group = document.createElement('div');
    group.className = 'image-marquee-group';
    if (copy) group.setAttribute('aria-hidden', 'true');
    for (const item of items) {
      const figure = createMedia(item);
      if (copy) figure.querySelector('img').tabIndex = -1;
      group.append(figure);
    }
    track.append(group);
  }
  element.append(track);
  const abort = new AbortController();
  let visible = false;
  let distance = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function seek(pixels) {
    if (reduced.matches) { element.scrollLeft += pixels; return; }
    const animation = track.getAnimations()[0];
    if (!animation || !distance) return;
    const duration = distance / 42 * 1000;
    // Seeking the compositor animation preserves its speed and seamless loop.
    const time = Number(animation.currentTime || 0) + pixels / 42 * 1000;
    animation.currentTime = ((time % duration) + duration) % duration;
  }
  element.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey) return;
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!horizontal && !event.shiftKey) return;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
    seek((horizontal ? event.deltaX : event.deltaY) * scale);
    event.preventDefault();
    event.stopPropagation();
  }, { passive: false, signal: abort.signal });
  element.addEventListener('focusin', event => {
    if (reduced.matches || event.target === element) return;
    const card = event.target.closest('.media-item');
    if (!card) return;
    const bounds = card.getBoundingClientRect(), viewport = element.getBoundingClientRect();
    if (bounds.left < viewport.left || bounds.right > viewport.right) {
      seek(bounds.left + bounds.width / 2 - viewport.left - viewport.width / 2);
    }
  }, { signal: abort.signal });
  element.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    seek((event.key === 'ArrowRight' ? 1 : -1) * 160);
    event.preventDefault();
    event.stopPropagation();
  }, { signal: abort.signal });
  let touch = null;
  element.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true, signal: abort.signal });
  element.addEventListener('touchmove', event => {
    if (!touch || event.touches.length !== 1) return;
    const next = event.touches[0];
    const dx = touch.x - next.clientX, dy = touch.y - next.clientY;
    if (Math.abs(dx) > Math.abs(dy) && event.cancelable) {
      seek(dx);
      event.preventDefault();
      event.stopPropagation();
    }
    touch = { x: next.clientX, y: next.clientY };
  }, { passive: false, signal: abort.signal });
  function sync() {
    element.dataset.running = String(visible && !document.hidden && !document.documentElement.hasAttribute('data-viewer-open'));
  }
  const visibility = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  });
  visibility.observe(element);
  // Decode the whole sequence before it reaches the viewport, including off-screen cards.
  const preload = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    element.querySelectorAll('img').forEach(img => { img.loading = 'eager'; img.decode().catch(() => {}); });
    preload.disconnect();
  }, { rootMargin: '1800px' });
  preload.observe(element);
  const resize = new ResizeObserver(() => {
    distance = track.firstElementChild.getBoundingClientRect().width;
    track.style.setProperty('--marquee-duration', `${distance / 42}s`);
  });
  resize.observe(track.firstElementChild);
  const viewer = new MutationObserver(sync);
  viewer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-viewer-open'] });
  document.addEventListener('visibilitychange', sync, { signal: abort.signal });
  sync();
  return { element, dispose() { abort.abort(); visibility.disconnect(); preload.disconnect(); resize.disconnect(); viewer.disconnect(); } };
}
