import { createMedia } from './media.js?v=22';
import { createMediaHeading } from './media-heading.js';

function createChangingPill(items, scrollRoot) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sticker-pack-pill';
  button.setAttribute('aria-label', `${items[0].alt} — сменить цвет`);
  button.style.aspectRatio = `${items[0].width} / ${items[0].height}`;
  const pictures = items.map(item => {
    const img = document.createElement('img');
    Object.assign(img, { src: item.src, alt: item.alt, width: item.width, height: item.height, decoding: 'async', draggable: false });
    return img;
  });
  button.append(pictures[0]);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  let index = 0, timer, visible = false, hovered = false, focused = false, busy = false, disposed = false;
  function schedule() {
    clearTimeout(timer);
    if (visible && !hovered && !focused && !busy && !disposed && !document.hidden && !reduced.matches && !document.documentElement.hasAttribute('data-viewer-open')) {
      timer = setTimeout(() => change(1), 1000);
    }
  }
  async function change(direction) {
    if (busy || disposed) return;
    clearTimeout(timer);
    busy = true;
    const next = (index + direction + pictures.length) % pictures.length;
    try {
      await pictures[next].decode();
      if (!disposed) {
        // Swap a decoded image atomically, matching the navigation labels.
        button.replaceChildren(pictures[next]);
        index = next;
      }
    } catch { /* Retain the last loaded variant if an asset is unavailable. */ }
    busy = false;
    schedule();
  }
  const listen = (target, name, handler) => target.addEventListener(name, handler, { signal: abort.signal });
  listen(button, 'click', () => change(1));
  listen(button, 'keydown', event => {
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  listen(button, 'pointerenter', () => { hovered = true; schedule(); });
  listen(button, 'pointerleave', () => { hovered = false; schedule(); });
  listen(button, 'focus', () => { focused = true; schedule(); });
  listen(button, 'blur', () => { focused = false; schedule(); });
  listen(document, 'visibilitychange', schedule);
  listen(document, 'portfolio-viewer-change', schedule);
  listen(reduced, 'change', schedule);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .5; schedule();
  }, { root: scrollRoot, threshold: [0, .5] });
  observer.observe(button);
  return { element: button, dispose() { disposed = true; clearTimeout(timer); observer.disconnect(); abort.abort(); } };
}

export function createStickerPack(data, scrollRoot) {
  const element = document.createElement('section');
  element.className = 'sticker-pack';
  element.setAttribute('aria-label', 'Стикерпак Спектрум');
  const pills = [data.title, data.who, data.pr].map(items => createChangingPill(items, scrollRoot));
  const collage = document.createElement('div');
  collage.className = 'sticker-pack-collage';
  for (const item of data.illustrations) {
    const figure = createMedia(item);
    figure.classList.add('sticker-pack-illustration', `sticker-${item.key}`);
    collage.append(figure);
  }
  const phrases = document.createElement('div');
  phrases.className = 'sticker-pack-phrases';
  const mirror = createMedia(data.mirror);
  const star = createMedia(data.star);
  star.classList.add('sticker-pack-star');
  phrases.append(pills[1].element, mirror, pills[2].element, star);
  element.append(createMediaHeading('Наклейки'), pills[0].element, collage, phrases);
  return { element, dispose() { pills.forEach(pill => pill.dispose()); } };
}
