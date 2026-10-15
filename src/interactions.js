import { setupTextScramble } from './text-scramble.js?v=5';
import { mobileLayout } from './responsive.js';
// Normalize wheel units without losing fractional trackpad deltas.
export function wheelPixels(event, pageHeight, lineHeight) {
  return event.deltaY * (event.deltaMode === 1 ? lineHeight : event.deltaMode === 2 ? pageHeight : 1);
}

export function proximityAt(x, y, rect, radius = 112) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  const distance = Math.hypot(dx, dy);
  const strength = Math.max(0, 1 - distance / radius);
  return strength * strength * (3 - 2 * strength);
}

export function setupInteractions(stage, { isScrollLocked = () => false } = {}) {
  const selector = '[data-proximity], .project-row';
  const scramble = setupTextScramble();
  const near = new WeakSet();
  let entries = [];
  let targetsDirty = true;
  let geometryDirty = true;
  let pointer = null;
  let frame = 0;
  let lineHeight = 18;
  let pageHeight = 0;
  let stageBounds;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame = 0, scrollTarget = 0, lastScrollTime = 0, lastDirection = 0;
  function stopScroll() { cancelAnimationFrame(scrollFrame); scrollFrame = 0; lastScrollTime = 0; scrollTarget = stage.scrollTop; }
  function easeScroll(time) {
    const elapsed = lastScrollTime ? Math.min(40, time - lastScrollTime) : 16;
    lastScrollTime = time;
    const distance = scrollTarget - stage.scrollTop;
    stage.scrollTop += distance * (1 - Math.exp(-elapsed / 65));
    if (Math.abs(distance) < 2 || isScrollLocked() || mobileLayout.matches) { stage.scrollTop = isScrollLocked() ? stage.scrollTop : scrollTarget; stopScroll(); return; }
    scrollFrame = requestAnimationFrame(easeScroll);
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  function refresh() { scramble.stopAll(); targetsDirty = true; geometryDirty = true; schedule(); }
  function invalidateGeometry() { geometryDirty = true; schedule(); }
  function paint() {
    frame = 0;
    if (targetsDirty) {
      const targets = [...document.querySelectorAll(selector)].filter(element => !element.closest('[hidden]'));
      const retained = new Set(targets);
      entries.forEach(entry => { if (!retained.has(entry.element)) entry.element.style.removeProperty('--proximity'); });
      entries = targets.map(element => ({ element, moving: stage.contains(element), value: '' }));
      targetsDirty = false;
      geometryDirty = true;
    }
    const scrollTop = stage.scrollTop;
    if (geometryDirty) {
      // Geometry is read only on resize/content change, never for each mouse pixel.
      const style = getComputedStyle(stage);
      lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4;
      pageHeight = stage.clientHeight;
      stageBounds = stage.getBoundingClientRect();
      entries.forEach(entry => {
        const parts = entry.element.matches('.project-row') ? [...entry.element.children] : [entry.element];
        const offset = entry.moving ? scrollTop : 0;
        entry.rects = parts.flatMap(part => {
          // Measure actual text lines, not the empty width of a block heading.
          const range = document.createRange();
          range.selectNodeContents(part);
          return [...range.getClientRects()].map(rect => ({
            left: rect.left, right: rect.right, top: rect.top + offset, bottom: rect.bottom + offset,
          }));
        });
      });
      geometryDirty = false;
    }
    // Only arithmetic and changed style writes during pointer/scroll frames.
    entries.forEach(entry => {
      let strength = 0;
      if (pointer) for (const cached of entry.rects) {
        const rect = entry.moving ? { ...cached, top: cached.top - scrollTop, bottom: cached.bottom - scrollTop } : cached;
        const visible = !entry.moving || (rect.bottom >= stageBounds.top && rect.top <= stageBounds.bottom);
        if (visible) strength = Math.max(strength, proximityAt(pointer.x, pointer.y, rect));
      }
      if (strength > .92 && !near.has(entry.element)) {
        near.add(entry.element);
        scramble.start(entry.element);
      } else if (strength < .25) near.delete(entry.element);
      const value = strength.toFixed(3);
      if (entry.value !== value) {
        entry.element.style.setProperty('--proximity', value);
        entry.value = value;
      }
    });
  }
  window.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey) return;
    const workNav=event.target.closest('.work-switcher, #project-info, .media-controls');
    if(workNav && workNav.scrollHeight>workNav.clientHeight) return;
    if (isScrollLocked()) {
      const pdf = document.querySelector('.image-viewer[open].is-document');
      if (pdf) return;
      if (event.cancelable) event.preventDefault();
      return;
    }
    if (mobileLayout.matches || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (!event.cancelable) return;
    event.preventDefault();
    const delta = wheelPixels(event, pageHeight || stage.clientHeight, lineHeight);
    if (reduced.matches) { stopScroll(); stage.scrollTop += delta; return; }
    if (!scrollFrame || Math.sign(delta) !== lastDirection) scrollTarget = stage.scrollTop;
    lastDirection = Math.sign(delta);
    scrollTarget = Math.max(0, Math.min(stage.scrollHeight - stage.clientHeight, scrollTarget + delta));
    if (!scrollFrame) scrollFrame = requestAnimationFrame(easeScroll);
  }, { passive: false });
  window.addEventListener('pointerdown', stopScroll, { passive: true });
  window.addEventListener('keydown', event => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) stopScroll(); });
  reduced.addEventListener('change', stopScroll);
  mobileLayout.addEventListener('change', stopScroll);
  document.addEventListener('portfolio-viewer-change', stopScroll);
  function reset() { pointer = null; scramble.stopAll(); schedule(); }
  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || mobileLayout.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    schedule();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  mobileLayout.addEventListener('change', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  window.addEventListener('resize', invalidateGeometry, { passive: true });
  window.addEventListener('scroll', invalidateGeometry, { passive: true });
  stage.addEventListener('scroll', () => { if (pointer && entries.some(entry => entry.moving)) schedule(); }, { passive: true });
  const resizeObserver = new ResizeObserver(invalidateGeometry);
  [stage, document.querySelector('.index'), document.querySelector('.header')].forEach(element => resizeObserver.observe(element));
  document.fonts.ready.then(invalidateGeometry);
  schedule();
  return { refresh, stopScroll };
}
