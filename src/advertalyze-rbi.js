import { createMedia } from './media.js?v=22';
import { mobileLayout } from './responsive.js';

export function createAdvertalyzeRbi(items, stage) {
  const element = document.createElement('section');
  element.className = 'advertalyze-rbi';
  element.setAttribute('aria-label', 'Advertalyze — Экзамен и кейс RBI');
  const exam = createMedia(items[0]);
  exam.classList.add('advertalyze-exam');
  const cover = createMedia(items[1]);
  cover.classList.add('rbi-cover');
  const staircase = document.createElement('div');
  staircase.className = 'rbi-staircase';
  const layers = items.slice(2, 6).map((item, index) => {
    const anchor = document.createElement('div');
    anchor.className = 'rbi-step';
    const figure = createMedia(item);
    figure.classList.add('rbi-parallax');
    anchor.append(figure);
    staircase.append(anchor);
    return { anchor, figure, amplitude: index % 2 ? 96 : 70 };
  });
  const phoneAnchor = document.createElement('div');
  phoneAnchor.className = 'rbi-phone-anchor';
  const phone = createMedia(items[6]);
  phone.classList.add('rbi-parallax', 'rbi-phone');
  phoneAnchor.append(phone);
  layers.push({ anchor: phoneAnchor, figure: phone, amplitude: 110 });
  element.append(exam, cover, staircase, phoneAnchor);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  let frame = 0;
  function paint() {
    frame = 0;
    const disabled = reduced.matches || document.hidden;
    const viewportHeight = innerHeight;
    const offsets = layers.map(({ anchor, amplitude }) => {
      if (disabled) return 0;
      // Measure the fixed layout wrapper, never the translated artwork.
      const rect = anchor.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (viewportHeight * .5 - rect.top - rect.height * .5) / (viewportHeight * .5 + rect.height * .5)));
      return progress * amplitude * (mobileLayout.matches ? .3 : 1);
    });
    layers.forEach(({ figure }, index) => figure.style.setProperty('--parallax-y', `${offsets[index].toFixed(2)}px`));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  for (const source of [stage, window]) source.addEventListener('scroll', schedule, { passive: true, signal: abort.signal });
  window.addEventListener('resize', schedule, { passive: true, signal: abort.signal });
  document.addEventListener('visibilitychange', schedule, { signal: abort.signal });
  reduced.addEventListener('change', schedule, { signal: abort.signal });
  const observer = new ResizeObserver(schedule);
  observer.observe(element);
  schedule();
  return { element, dispose() { abort.abort(); observer.disconnect(); cancelAnimationFrame(frame); } };
}
