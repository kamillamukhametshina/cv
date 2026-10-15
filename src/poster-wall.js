import { createMedia } from './media.js?v=22';
import { createMediaHeading } from './media-heading.js';

export function createPosterWall(data, scrollRoot) {
  const element = document.createElement('section');
  element.className = 'poster-wall';
  element.setAttribute('aria-label', 'Плакаты Спектрум');
  element.append(createMediaHeading('Плакаты'));
  const groups = [data.media.slice(0, 10), data.media.slice(10)].map((items, index) => {
    const grid = document.createElement('div');
    grid.className = `poster-wall-grid ${index ? 'poster-wall-bottom' : 'poster-wall-top'}`;
    const slots = items.map(item => {
      const slot = document.createElement('div');
      slot.className = 'poster-wall-slot';
      slot.append(createMedia(item));
      grid.append(slot);
      return slot;
    });
    element.append(grid);
    return { grid, slots, visible: false };
  });
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer, phaseTimer, activePair, preparing = false, disposed = false, hovered = false, focused = false, entryPending = false;
  function canRun() {
    return !disposed && !document.hidden && !reduced.matches && !hovered && !focused && !document.documentElement.hasAttribute('data-viewer-open');
  }
  function finish() {
    clearTimeout(phaseTimer);
    if (activePair) activePair.forEach(slot => slot.classList.remove('is-glitch-hidden'));
    activePair = null;
  }
  function schedule(onEntry = false) {
    if (onEntry === true) entryPending = true;
    clearTimeout(timer);
    if (!canRun() || !groups.some(group => group.visible)) { finish(); return; }
    if (!activePair && !preparing) timer = setTimeout(glitch, entryPending ? 3000 : 200 + Math.random() * 200);
  }
  async function glitch() {
    const available = groups.filter(group => group.visible);
    if (!canRun() || !available.length) return;
    // Choose within one group: the six tall posters never enter the upper rows.
    const group = available[Math.floor(Math.random() * available.length)];
    // Prefer posters currently on screen so the first swap is visible on entry.
    const onScreen = group.slots.filter(slot => {
      const bounds = slot.getBoundingClientRect();
      return bounds.bottom > 24 && bounds.top < innerHeight - 24;
    });
    const candidates = onScreen.length >= 2 ? onScreen : group.slots;
    const firstIndex = Math.floor(Math.random() * candidates.length);
    const offset = 1 + Math.floor(Math.random() * (candidates.length - 1));
    const first = candidates[firstIndex];
    const second = candidates[(firstIndex + offset) % candidates.length];
    preparing = true;
    try { await Promise.all([first, second].map(slot => slot.querySelector('img').decode())); }
    catch { preparing = false; entryPending = false; schedule(); return; }
    preparing = false;
    if (!canRun() || !group.visible) { schedule(); return; }
    entryPending = false;
    activePair = [first, second];
    first.classList.add('is-glitch-hidden');
    phaseTimer = setTimeout(() => {
      second.classList.add('is-glitch-hidden');
      const firstPoster = first.firstElementChild;
      first.replaceChildren(second.firstElementChild);
      second.append(firstPoster);
      first.classList.remove('is-glitch-hidden');
      phaseTimer = setTimeout(() => { finish(); schedule(); }, 500);
    }, 500);
  }
  const observer = new IntersectionObserver(entries => {
    const wasVisible = groups.some(group => group.visible);
    for (const entry of entries) {
      groups.find(group => group.grid === entry.target).visible = entry.isIntersecting && entry.intersectionRatio >= .1;
    }
    schedule(!wasVisible && groups.some(group => group.visible));
  }, { root: scrollRoot, threshold: [0, .1] });
  groups.forEach(group => observer.observe(group.grid));
  const listen = (target, event, handler) => target.addEventListener(event, handler, { signal: abort.signal });
  // Keep a poster still while it is being selected or inspected.
  listen(element, 'pointerover', event => { hovered = !!event.target.closest('.poster-wall-slot'); schedule(); });
  listen(element, 'pointerleave', () => { hovered = false; schedule(); });
  listen(element, 'focusin', () => { focused = true; schedule(); });
  listen(element, 'focusout', event => { focused = element.contains(event.relatedTarget); schedule(); });
  listen(document, 'visibilitychange', schedule);
  listen(document, 'portfolio-viewer-change', schedule);
  listen(reduced, 'change', schedule);
  return { element, dispose() { disposed = true; clearTimeout(timer); finish(); observer.disconnect(); abort.abort(); } };
}
