import { createMedia } from './media.js?v=22';
import { createComparison } from './comparison.js?v=6';

export function createFDate(data, filter, scrollRoot) {
  const element = document.createElement('section');
  element.className = `f-date-content f-date-${filter}`;
  const disposers = [];
  if (filter === 'partners') {
    const slides = document.createElement('div');
    slides.className = 'f-date-partner-slides';
    data.partners.forEach((item, index) => {
      if (item.before) {
        const comparison = createComparison({
          ...item, after: item.src, label: item.alt,
          initial: 97, afterFirst: true, hint: index === 0, hintOutside: true,
        }, scrollRoot);
        slides.append(comparison.element);
        disposers.push(comparison.dispose);
      } else {
        slides.append(createMedia({ ...item, caption: item.alt }));
      }
    });
    element.append(slides);
  } else if (filter === 'ambassadors') {
    const slides = document.createElement('div');
    slides.className = 'f-date-ambassador-slides';
    slides.append(...data.ambassadors.map(item => createMedia({ ...item, caption: item.alt })));
    element.append(slides);
  } else {
    element.append(createMedia(data.cover));
    const cards = document.createElement('div');
    cards.className = 'f-date-cards';
    const pairs = data.cards.map(pair => {
      const slot = document.createElement('div');
      slot.className = 'f-date-card';
      const versions = pair.map(createMedia);
      slot.append(...versions);
      cards.append(slot);
      return versions;
    });
    let variant = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function paint() {
      pairs.forEach(versions => versions.forEach((figure, index) => {
        const active = index === variant;
        figure.classList.toggle('is-active', active);
        figure.inert = !active;
        figure.setAttribute('aria-hidden', String(!active));
      }));
    }
    paint();
    const timer = setInterval(() => {
      if (reduced.matches || document.documentElement.hasAttribute('data-viewer-open') || cards.contains(document.activeElement)) return;
      variant = 1 - variant;
      paint();
    }, 2000);
    disposers.push(() => clearInterval(timer));
    element.append(cards);
  }
  return { element, dispose() { disposers.forEach(dispose => dispose()); } };
}
