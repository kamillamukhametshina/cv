import { createCatchCounter, catchStorageKey } from './fly-counter.js';
export function flyPosition(width, height, size, previous, random = Math.random) {
  const maxX = Math.max(0, width - size), maxY = Math.max(0, height - size);
  let next;
  for (let attempt = 0; attempt < 16; attempt++) {
    next = { x: random() * maxX, y: random() * maxY };
    if (!previous || Math.hypot(next.x - previous.x, next.y - previous.y) > Math.min(width, height) * .3) return next;
  }
  return { x: previous.x < maxX / 2 ? maxX : 0, y: previous.y < maxY / 2 ? maxY : 0 };
}

// A new secret catch attempt is picked for every round: never the first tap,
// and always reachable without an endless run of unlucky misses.
export function createFlyRound(random = Math.random) {
  let attempts = 0;
  const catchAt = 3 + Math.floor(random() * 6);
  return { attempt() { attempts++; return attempts === catchAt; } };
}

export function createFlyHome({ minScale = .22, scaleRange = .36, challenge = 'Поймай меня, если сможешь' } = {}) {
  const element = document.createElement('section');
  element.className = 'fly-home';
  element.setAttribute('aria-label', 'Цифровой архив Камиллы Мухаметшиной');
  const heading = document.createElement('p');
  heading.className = 'fly-home-challenge';
  heading.textContent = challenge;
  const playground = document.createElement('div');
  playground.className = 'fly-home-playground';
  const swatter = document.createElement('div');
  swatter.className = 'fly-home-swatter'; swatter.hidden = true;
  swatter.setAttribute('aria-hidden', 'true');
  const swatterHead = document.createElement('div');
  swatterHead.className = 'fly-swatter-head';
  const swatterLabel = document.createElement('span');
  swatterLabel.className = 'fly-swatter-label';
  swatterLabel.textContent = 'Инв. № 001 / мухобойка';
  const swatterHandle = document.createElement('div');
  swatterHandle.className = 'fly-swatter-handle';
  swatter.append(swatterLabel, swatterHead, swatterHandle);
  const status = document.createElement('div');
  status.className = 'fly-home-status'; status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
  const fly = document.createElement('button');
  fly.type = 'button';
  fly.className = 'fly-home-object';
  fly.setAttribute('aria-label', 'Поймать муху');
  const image = document.createElement('img');
  image.src = './assets/fly/fly-final.png'; image.alt = ''; image.draggable = false;
  const video = document.createElement('video');
  video.src = './assets/fly/fly-final.webm'; video.muted = true; video.loop = true;
  video.playsInline = true; video.preload = 'auto'; video.dataset.selfManaged = ''; video.setAttribute('aria-hidden', 'true');
  fly.append(image, video); playground.append(fly, swatter);
  const counter = document.createElement('p');
  counter.className = 'fly-catch-counter';
  let storage;
  try { storage = window.localStorage; } catch { /* Storage may be disabled. */ }
  const catches = createCatchCounter(storage);
  const paintCount = () => { counter.textContent = `Поймано мух: ${catches.value}`; };
  paintCount();
  element.append(heading, counter, playground, status);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController(), options = { signal: abort.signal };
  let size = 0, point, timer, releaseTimer, statusTimer, disposed = false, caught = false;
  window.addEventListener('storage', event => { if (event.key === catchStorageKey) { catches.refresh(); paintCount(); } }, options);
  let round = createFlyRound();
  function move(resize = true) {
    const bounds = playground.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    if (resize || !size) size = Math.min(bounds.width, bounds.height) * (minScale + Math.random() * scaleRange);
    size = Math.min(size, bounds.width, bounds.height);
    point = flyPosition(bounds.width, bounds.height, size, point);
    fly.style.width = `${size}px`; fly.style.height = `${size}px`;
    fly.style.transform = `translate(${point.x}px, ${point.y}px)`;
  }
  function schedule() {
    clearTimeout(timer);
    if (disposed || caught || document.hidden || reduced.matches) return;
    timer = setTimeout(() => {
      if (!document.documentElement.hasAttribute('data-mobile-menu')) move(true);
      schedule();
    }, 2000);
  }
  function attempt() {
    if (caught || disposed) return;
    if (!round.attempt()) { move(false); schedule(); return; }
    caught = true;
    catches.increment();
    paintCount();
    clearTimeout(timer); clearTimeout(statusTimer);
    video.pause();
    fly.setAttribute('aria-disabled', 'true');
    element.classList.add('is-caught'); element.classList.remove('is-escaped');
    // Strike at the actual catch location; the fly keeps its scale and position.
    const headSize = size + 28;
    swatter.style.setProperty('--swatter-size', `${headSize}px`);
    swatter.style.left = `${point.x - 14}px`;
    swatter.style.top = `${point.y - 14}px`;
    swatter.hidden = false;
    status.textContent = 'Контакт зафиксирован';
    releaseTimer = setTimeout(() => {
      if (disposed) return;
      caught = false; round = createFlyRound();
      fly.removeAttribute('aria-disabled');
      element.classList.remove('is-caught'); element.classList.add('is-escaped');
      swatter.hidden = true;
      status.textContent = 'Объект жив и покинул архив';
      const from = { ...point };
      move(false);
      if (!reduced.matches) fly.animate([
        { transform: `translate(${from.x}px, ${from.y}px) rotate(0deg)` },
        { transform: `translate(${from.x + (point.x - from.x) * .3}px, ${from.y + (point.y - from.y) * .3}px) rotate(-16deg)`, offset: .3 },
        { transform: `translate(${point.x}px, ${point.y}px) rotate(0deg)` }
      ], { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)' });
      playback();
      statusTimer = setTimeout(() => { status.replaceChildren(); element.classList.remove('is-escaped'); }, 2000);
    }, 3400);
  }
  fly.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault(); attempt();
  }, options);
  fly.addEventListener('click', event => { if (event.detail === 0) attempt(); }, options);
  const observer = new ResizeObserver(() => { if (!caught) move(!size); }); observer.observe(playground);
  function playback() {
    if (document.hidden || reduced.matches || caught) video.pause();
    else video.play().catch(() => {});
    schedule();
  }
  video.addEventListener('playing', () => video.classList.add('is-playing'), options);
  video.addEventListener('error', () => video.classList.remove('is-playing'), options);
  document.addEventListener('visibilitychange', playback, options);
  reduced.addEventListener('change', playback, options);
  playback();
  return { element, dispose() { disposed = true; clearTimeout(timer); clearTimeout(releaseTimer); clearTimeout(statusTimer); observer.disconnect(); abort.abort(); video.pause(); video.removeAttribute('src'); video.load(); } };
}
