// Recognize horizontal intent without taking over ordinary vertical page scrolling.
export function setupHorizontalDrag(element, { enabled = () => true, start = () => {}, move = () => {}, end = () => {} }) {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let gesture = null, suppressClickUntil = 0;
  const finish = (event, cancelled = false) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const current = gesture;
    gesture = null;
    if (current.active) {
      suppressClickUntil = Date.now() + 500;
      if (!cancelled) end(event.clientX - current.x, event);
    }
    if (element.hasPointerCapture?.(current.id)) element.releasePointerCapture(current.id);
  };
  element.addEventListener('pointerdown', event => {
    if (event.isPrimary === false) { gesture = null; return; }
    if ((event.button != null && event.button !== 0) || !enabled(event)) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, active: false };
    // Capture immediately so a finger can keep controlling the element even
    // when it slips outside its bounds. CSS touch-action still leaves vertical
    // page scrolling to the browser.
    element.setPointerCapture?.(event.pointerId);
  }, options);
  element.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.active) {
      if (Math.abs(dy) > 5 && Math.abs(dy) > Math.abs(dx)) { finish(event, true); return; }
      if (Math.abs(dx) < 3 || Math.abs(dx) < Math.abs(dy)) return;
      gesture.active = true;
      element.setPointerCapture(event.pointerId);
      start(event);
    }
    if (event.cancelable) event.preventDefault();
    move(dx, event);
  }, options);
  element.addEventListener('pointerup', event => finish(event), options);
  for (const name of ['pointercancel', 'lostpointercapture']) element.addEventListener(name, event => finish(event, true), options);
  element.addEventListener('dragstart', event => { if (enabled(event)) event.preventDefault(); }, options);
  element.addEventListener('click', event => {
    if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, { ...options, capture: true });
  return () => { gesture = null; abort.abort(); };
}
