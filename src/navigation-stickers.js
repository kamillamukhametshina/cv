import { typography } from './typography.js?v=5';

export function createNavigationStickers(data, scrollRoot) {
  const element = document.createElement('section');
  element.className = 'navigation-stickers';
  element.setAttribute('aria-label', data.title);
  const heading = document.createElement('p'); heading.className = 'media-heading';
  for (const text of [data.title, 'Наружные коммуникации']) {
    const span = document.createElement('span'); span.textContent = typography(text); heading.append(span);
  }
  const row = document.createElement('div'); row.className = 'navigation-sticker-row';
  element.style.setProperty('--max-sticker-ratio', data.maxRatio);
  function picture(item) {
    // Crop only export margins in CSS; preserve the original asset and its proportions.
    const [x, y, width, height] = item.bounds || [0, 0, item.width, item.height];
    const frame = document.createElement('span'); frame.className = 'navigation-sticker-image';
    frame.style.width = `calc(var(--sticker-height) * ${width / height})`;
    const img = document.createElement('img'); img.src = item.src; img.alt = item.alt;
    img.width = item.width; img.height = item.height; img.decoding = 'async'; img.draggable = false;
    Object.assign(img.style, { width: `${item.width / width * 100}%`, height: `${item.height / height * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` });
    frame.append(img);
    return { frame, img };
  }
  const arrow = picture(data.arrow); arrow.frame.classList.add('navigation-sticker-arrow'); arrow.img.loading = 'lazy';
  const button = document.createElement('button'); button.type = 'button'; button.className = 'navigation-sticker-label';
  button.setAttribute('aria-label', 'Следующая навигационная наклейка');
  button.title = 'Нажми, чтобы сменить наклейку';
  let current = picture(data.labels[0]); current.img.loading = 'lazy'; button.append(current.frame);
  row.append(arrow.frame, button); element.append(heading, row);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  let index = 0, timer = 0, visible = false, hovered = false, focused = false, busy = false, disposed = false, prepared;
  function prepare(nextIndex) {
    if (prepared?.index === nextIndex) return prepared.promise;
    const next = picture(data.labels[nextIndex]);
    const promise = next.img.decode().then(() => next, () => null);
    prepared = { index: nextIndex, promise };
    return promise;
  }
  function canCycle() { return visible && !hovered && !focused && !document.hidden && !reduced.matches && !document.documentElement.hasAttribute('data-viewer-open') && !disposed; }
  function schedule() {
    clearTimeout(timer);
    if (canCycle() && !busy) {
      prepare((index + 1) % data.labels.length);
      timer = setTimeout(() => change(1), 1000);
    }
  }
  async function change(direction) {
    if (busy || disposed) return;
    clearTimeout(timer); busy = true;
    const nextIndex = (index + direction + data.labels.length) % data.labels.length;
    const next = await prepare(nextIndex);
    if (disposed) return;
    if (!next) { busy = false; prepared = null; schedule(); return; }
    // Atomic replacement: no fade, overlap, or intermediate empty frame.
    button.replaceChildren(next.frame);
    current = next; index = nextIndex; prepared = null; busy = false; schedule();
  }
  button.addEventListener('click', () => change(1), { signal: abort.signal });
  button.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1); }
  }, { signal: abort.signal });
  button.addEventListener('pointerenter', () => { hovered = true; schedule(); }, { signal: abort.signal });
  button.addEventListener('pointerleave', () => { hovered = false; schedule(); }, { signal: abort.signal });
  button.addEventListener('focus', () => { focused = true; schedule(); }, { signal: abort.signal });
  button.addEventListener('blur', () => { focused = false; schedule(); }, { signal: abort.signal });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .5; schedule(); }, { root: scrollRoot, threshold: [0, .5] });
  observer.observe(element);
  document.addEventListener('visibilitychange', schedule, { signal: abort.signal });
  document.addEventListener('portfolio-viewer-change', schedule, { signal: abort.signal });
  reduced.addEventListener('change', schedule, { signal: abort.signal });
  return { element, dispose() { disposed = true; clearTimeout(timer); prepared = null; observer.disconnect(); abort.abort(); } };
}
