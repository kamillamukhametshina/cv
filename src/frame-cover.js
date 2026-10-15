import { createFrameMotion } from './frame-motion.js';

// The card remains one accessible button; the canvas never intercepts its tap.
export function mountFrameCover(button, cover, openCase, mobileLayout, data) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  cover.append(canvas);
  cover.classList.add('is-frame-cover');
  const ctx = canvas.getContext('2d');
  const motion = createFrameMotion();
  const settings = { ...data.settings };
  const control = motion.controller(settings);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  let images, loading, raf = 0, visible = false, disposed = false;
  let hovered = false, focused = false, lastPaint = -Infinity;
  const started = performance.now();
  const on = (target, event, handler) => target.addEventListener(event, handler, { signal: abort.signal });
  function paint(now) {
    raf = 0;
    if (!images || disposed || !visible || document.hidden) return;
    const progress = reduced.matches ? control.target() : control.value(now);
    const moving = !reduced.matches && (control.active(now) || progress < 1 || settings.hud);
    if (now - lastPaint >= 1000 / 30 || !moving) {
      motion.draw(ctx, ...images, data.frames, progress,
        reduced.matches ? { ...settings, amount: 0 } : settings,
        (now - started) / 1000 + data.timeOffset);
      lastPaint = now;
      canvas.dataset.assembled = String(progress >= 1);
    }
    if (moving) raf = requestAnimationFrame(paint);
  }
  function schedule() {
    if (images && visible && !disposed && !document.hidden && !raf) raf = requestAnimationFrame(paint);
  }
  function load() {
    if (!loading) loading = Promise.all([data.original, data.fragments, data.background].map(src => new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src;
    }))).then(loaded => {
      if (disposed) return;
      images = loaded; canvas.width = images[0].width; canvas.height = images[0].height;
      cover.classList.add('is-frame-ready'); schedule();
    });
    return loading;
  }
  function respond() {
    settings.assemble = data.settings.assemble;
    control.set(!mobileLayout.matches && (hovered || focused), performance.now()); schedule();
  }
  on(button, 'pointerenter', event => { if (event.pointerType !== 'touch' && !mobileLayout.matches) { hovered = true; respond(); } });
  on(button, 'pointerleave', () => { hovered = false; respond(); });
  on(button, 'focus', () => { if (button.matches(':focus-visible')) { focused = true; respond(); } });
  on(button, 'blur', () => { focused = false; respond(); });
  on(button, 'click', openCase);
  on(document, 'visibilitychange', schedule);
  on(reduced, 'change', schedule);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { load().catch(() => {}); schedule(); }
    else { cancelAnimationFrame(raf); raf = 0; }
  }, { rootMargin: '120px' });
  observer.observe(button);
  return () => { disposed = true; abort.abort(); observer.disconnect(); cancelAnimationFrame(raf); };
}
