import { typography } from './typography.js?v=4';
import { imageSource } from './mobile-media.js';
import { setupHorizontalDrag } from './horizontal-drag.js';
const demonstrated = new Set();

export function createComparison(data, scrollRoot) {
  const element = document.createElement('figure');
  element.className = 'comparison';
  const frame = document.createElement('div');
  frame.className = 'comparison-frame';
  frame.classList.toggle('comparison-after-first', !!data.afterFirst);
  const initial = data.initial ?? 50;
  frame.style.aspectRatio = `${data.width} / ${data.height}`;
  for (const side of ['after', 'before']) {
    const image = document.createElement('img');
    image.className = `comparison-${side}`;
    image.src = imageSource(data[side]);
    image.alt = `${data.label} — ${side === 'before' ? 'до' : 'после'}`;
    image.width = data.width; image.height = data.height;
    image.loading = 'lazy'; image.decoding = 'async';
    frame.append(image);
  }
  // Render unchanged details from the same source above both comparison layers.
  // Percentage coordinates keep exact alignment at every responsive size.
  for (const polygon of data.sharedRegions || []) {
    const detail = document.createElement('img');
    detail.className = 'comparison-shared';
    detail.src = imageSource(data.after); detail.alt = ''; detail.setAttribute('aria-hidden', 'true');
    detail.width = data.width; detail.height = data.height;
    detail.loading = 'lazy'; detail.decoding = 'async';
    detail.style.clipPath = `polygon(${polygon.map(([x, y]) => `${x / data.width * 100}% ${y / data.height * 100}%`).join(',')})`;
    frame.append(detail);
  }
  const line = document.createElement('span');
  line.className = 'comparison-divider';
  line.setAttribute('aria-hidden', 'true');
  const handle = document.createElement('span');
  handle.className = 'comparison-handle'; handle.textContent = '↔';
  line.append(handle);
  const input = document.createElement('input');
  input.type = 'range'; input.min = '0'; input.max = '100'; input.value = '50'; input.step = '1';
  input.className = 'comparison-range';
  input.setAttribute('aria-label', `${data.label}: сравнение до и после`);
  const labels = document.createElement('div');
  labels.className = 'comparison-labels'; labels.setAttribute('aria-hidden', 'true');
  for (const text of (data.afterFirst ? ['После', 'До'] : ['До', 'После'])) { const label = document.createElement('span'); label.textContent = text; labels.append(label); }
  const caption = document.createElement('figcaption');
  caption.className = 'media-heading';
  const title = document.createElement('span');
  title.textContent = typography(data.label);
  const category = document.createElement('span');
  category.className = 'media-heading-category';
  category.textContent = typography(data.category || '');
  caption.append(title, category);
  const hint = document.createElement('span');
  hint.className = 'comparison-hint';
  hint.textContent = 'Проведите по изображению ↔';
  hint.setAttribute('aria-hidden', 'true');
  if (data.hint !== false) (data.hintOutside ? caption : frame).append(hint);
  frame.append(labels, line, input); element.append(caption, frame);
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animation = 0;
  let touched = false;
  function paint(value) {
    input.value = String(value);
    frame.style.setProperty('--split', `${value}%`);
    const before = data.afterFirst ? 100 - Math.round(value) : Math.round(value);
    input.setAttribute('aria-valuetext', `До: ${before}%, после: ${100 - before}%`);
  }
  function stop() { cancelAnimationFrame(animation); animation = 0; }
  function interact() { touched = true; demonstrated.add(data.before); stop(); }
  function paintAt(event) {
    const bounds = frame.getBoundingClientRect();
    paint(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)));
  }
  const stopDrag = setupHorizontalDrag(frame, {
    start: interact,
    move: (_delta, event) => paintAt(event),
    end: (_delta, event) => paintAt(event),
  });
  frame.addEventListener('click', event => {
    if (event.detail === 0) return;
    interact(); paintAt(event);
  }, { signal: abort.signal });
  input.addEventListener('pointerdown', interact, { signal: abort.signal });
  input.addEventListener('keydown', interact, { signal: abort.signal });
  input.addEventListener('input', () => { interact(); paint(Number(input.value)); }, { signal: abort.signal });
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || entries[0].intersectionRatio < .2) { stop(); if (!touched) paint(initial); return; }
    if (data.hint === false || touched || demonstrated.has(data.before) || reduced.matches) return;
    demonstrated.add(data.before);
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / 1600);
      paint(initial + (data.afterFirst ? -10 : 17) * Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI));
      if (t < 1) animation = requestAnimationFrame(tick); else { paint(initial); animation = 0; }
    };
    animation = requestAnimationFrame(tick);
  }, { root: scrollRoot, threshold: .2 });
  observer.observe(frame);
  reduced.addEventListener('change', () => { if (reduced.matches) { stop(); if (!touched) paint(initial); } }, { signal: abort.signal });
  paint(initial);
  return { element, dispose() { stop(); stopDrag(); observer.disconnect(); abort.abort(); } };
}
