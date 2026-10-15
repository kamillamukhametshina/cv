import { mobileLayout } from './responsive.js';

export function setupMobileRails(root) {
  if (!mobileLayout.matches) return () => {};
  const rails = [...root.querySelectorAll('.internal-filters, .sticker-pack-collage, .citydrive-guide-pages')];
  const cleanups = rails.map(rail => {
    rail.classList.add('mobile-scroll-rail');
    const hint = document.createElement('p');
    hint.className = 'mobile-scroll-hint';
    hint.textContent = 'Листайте в стороны ↔';
    if (rail.matches('.sticker-pack-collage')) { hint.classList.add('sticker-scroll-hint'); rail.after(hint); }
    else rail.before(hint);
    const update = () => {
      hint.hidden = rail.scrollWidth <= rail.clientWidth + 2;
      rail.classList.toggle('has-more-right', rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2);
      rail.classList.toggle('has-more-left', rail.scrollLeft > 2);
    };
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    rail.addEventListener('scroll', update, { passive: true });
    const selected = rail.querySelector('[aria-pressed="true"]');
    if (selected) rail.scrollLeft = selected.offsetLeft - rail.offsetLeft - 12;
    update();
    return () => { observer.disconnect(); rail.removeEventListener('scroll', update); hint.remove(); };
  });
  return () => cleanups.forEach(cleanup => cleanup());
}

// Capture the stable surface immediately: changing an image must not lose the finger.
export function setupObjectSwipe(element, { start, move, end }) {
  let gesture = null, suppressClickUntil = 0;
  const abort = new AbortController(), options = { signal: abort.signal, passive: false };
  element.addEventListener('pointerdown', event => {
    if (!mobileLayout.matches || event.isPrimary === false || gesture || (event.button != null && event.button !== 0)) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, width: Math.max(1, element.clientWidth), height: Math.max(1, element.clientHeight), active: false };
    element.setPointerCapture(event.pointerId);
    start(event);
  }, options);
  element.addEventListener('pointermove', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.active && Math.hypot(dx, dy) < 3) return;
    gesture.active = true;
    if (event.cancelable) event.preventDefault();
    move(dx / gesture.width, { y: dy / gesture.height, dx, dy });
  }, options);
  const finish = event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const current = gesture;
    gesture = null;
    if (current.active) suppressClickUntil = Date.now() + 500;
    end({ moved: current.active, cancelled: event.type !== 'pointerup' });
    if (element.hasPointerCapture?.(current.id)) element.releasePointerCapture(current.id);
  };
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) element.addEventListener(name, finish, options);
  element.addEventListener('dragstart', event => { if (mobileLayout.matches) event.preventDefault(); }, options);
  element.addEventListener('click', event => {
    if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, { ...options, capture: true });
  return () => { gesture = null; abort.abort(); };
}
