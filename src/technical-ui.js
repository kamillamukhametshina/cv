import { setupTextScramble } from './text-scramble.js?v=5';
export function setupTechnicalUI() {
  const cursor = document.createElement('div');
  cursor.className = 'technical-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.hidden = true;
  const feedback = document.createElement('div');
  feedback.className = 'technical-feedback';
  feedback.setAttribute('aria-hidden', 'true');
  feedback.hidden = true;
  document.body.append(cursor, feedback);
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let point, frame = 0;
  function hideCursor() {
    cursor.hidden = true;
    document.documentElement.classList.remove('has-technical-cursor');
  }
  function paint() {
    frame = 0;
    if (!point || !finePointer.matches || document.hidden) { hideCursor(); return; }
    const { x, y } = point;
    cursor.textContent = `X:${String(Math.round(x)).padStart(4, '0')} Y:${String(Math.round(y)).padStart(4, '0')}`;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    cursor.classList.toggle('is-left', x > innerWidth - 150);
    cursor.classList.toggle('is-above', y > innerHeight - 34);
    cursor.hidden = false;
    document.documentElement.classList.add('has-technical-cursor');
  }
  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') { point = null; hideCursor(); return; }
    point = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });
  for (const [target, name] of [[window, 'blur'], [document.documentElement, 'pointerleave']]) {
    target.addEventListener(name, () => { point = null; hideCursor(); });
  }
  finePointer.addEventListener('change', hideCursor);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { point = null; hideCursor(); } });
  function show(action, label, count) {
    feedback.replaceChildren();
    const status = document.createElement('span');
    status.textContent = count == null ? action : `Found: ${String(count).padStart(2, '0')} items / ${action}`;
    const destination = document.createElement('span');
    destination.textContent = label;
    feedback.append(status, destination);
    feedback.hidden = false;
  }
  let hovered = null;
  document.addEventListener('pointerover', event => {
    if (event.pointerType === 'touch') return;
    const object = event.target.closest('img, video, canvas, a, button, [data-document]');
    if (!object || object === hovered || object.closest('.technical-feedback')) return;
    hovered = object;
    const label = object.getAttribute('alt') || object.getAttribute('aria-label') || object.textContent.trim();
    if (label) show('Hover / объект', label);
  });
  document.addEventListener('pointerout', event => { if (hovered && !hovered.contains(event.relatedTarget)) hovered = null; });
  const name = document.querySelector('#home');
  const nameScramble = setupTextScramble();
  const names = ['Камилла Мухаметшина', 'Цифровой архив работ'];
  let nameIndex = 0;
  setInterval(() => {
    if (!name || document.hidden) return;
    nameScramble.stopAll(); nameIndex = 1 - nameIndex;
    name.textContent = names[nameIndex];
    name.setAttribute('aria-label', names[nameIndex]);
    nameScramble.start(name);
  }, 5000);
  document.addEventListener('portfolio-viewer-change' , () => queueMicrotask(() => {
    const dialog = document.querySelector('.image-viewer[open]');
    (dialog || document.body).append(cursor, feedback);
    if (dialog) show('File opened', 'Просмотр материалов');
  }));
  return { show };
}
