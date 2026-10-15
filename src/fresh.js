import { garmentBounds } from './fresh-garment-bounds.js';
import { createMedia } from './media.js?v=22';
import { createImageMarquee } from './image-marquee.js?v=5';
import { createMediaHeading } from './media-heading.js';
import { setupLumaReveal } from './fresh-luma.js?v=3';
import { mobileLayout } from './responsive.js';

export function createFresh(section, scrollRoot = null) {
  const element = document.createElement('section');
  element.className = `fresh-content fresh-${section.id}`;
  element.setAttribute('aria-label', section.label);
  const disposers = [];
  for (const block of section.blocks) {
    if (block.className === 'fresh-marquee') {
      const title = block.media[0].caption.split(' — ')[0];
      const marquee = createImageMarquee(block.media, `Fresh — ${title}. Прокрутка влево и вправо`);
      marquee.element.classList.add('fresh-block', 'fresh-presentation-marquee');
      marquee.element.prepend(createMediaHeading(title));
      moveCaptions(marquee.element);
      element.append(marquee.element);
      disposers.push(marquee.dispose);
      continue;
    }
    const row = document.createElement('div');
    row.className = `fresh-block ${block.className}`;
    if (/fresh-uniform|fresh-car-variants/.test(block.className)) {
      disposers.push(setupVariants(row, block.media, scrollRoot));
    } else {
      row.append(...block.media.map(createMedia));
      moveCaptions(row);
    }
    element.append(row);
    if (block.className.includes('fresh-liquids')) disposers.push(setupLumaReveal(row, scrollRoot));
  }
  return { element, dispose() { disposers.forEach(dispose => dispose()); } };
}

function moveCaptions(container) {
  for (const figure of container.querySelectorAll('.media-item')) {
    const caption = figure.querySelector('figcaption');
    if (caption) figure.prepend(caption);
  }
}

function setupVariants(row, items, root) {
  const clothes = row.classList.contains('fresh-uniform');
  const groups = [];
  const abort = new AbortController();
  const swipeDisposers = [];
  let variant = 0;
  let visible = false;
  let ready = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  for (let i = 0; i < items.length; i += 2) {
    const pair = items.slice(i, i + 2);
    const slot = document.createElement('section');
    slot.className = 'fresh-variant';
    const label = clothes ? pair[0].caption : i === 0 ? 'Оклейка — седан' : 'Оклейка — универсал';
    slot.setAttribute('aria-label', label);
    const header = document.createElement('div');
    header.className = 'fresh-variant-header';
    header.append(createMediaHeading(label));
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'fresh-variant-toggle';
    toggle.addEventListener('click', () => {
      if (clothes) { const group = groups.find(group => group.toggle === toggle); group.variant = 1 - group.variant; group.nextChange = nextChange(); }
      else variant = 1 - variant;
      paint();
    }, { signal: abort.signal });
    header.append(toggle);
    const layers = document.createElement('div');
    layers.className = `fresh-variant-layers ${clothes ? 'fresh-garment' : 'fresh-car'}`;
    if (clothes) {
      const [, , width, height] = garmentBounds[pair[0].src][0];
      layers.style.setProperty('--garment-ratio', width / height);
    }
    const figures = pair.map(item => {
      // Keep the original item identity so either visible version opens in the gallery.
      const figure = createMedia(item);
      figure.querySelector('figcaption')?.remove();
      const img = figure.querySelector('img');
      img.loading = 'eager';
      if (clothes) {
        const [x, y, w, h] = garmentBounds[item.src][item.half];
        img.style.cssText = `width:${item.width / w * 100}%;height:${item.height / h * 100}%;left:${-x / w * 100}%;top:${-y / h * 100}%;`;
      } else {
        // Fit each transparent cutout to the same silhouette area without moving the row.
        const [x, y, w, h] = item.bounds;
        img.style.cssText = `width:${item.width / w * 100}%;height:${item.height / h * 100}%;left:${-x / w * 100}%;top:${-y / h * 100}%;`;
      }
      layers.append(figure);
      return figure;
    });
    slot.append(header, layers);
    row.append(slot);
    const group = { figures, layers, toggle, label, variant: 0, nextChange: nextChange(), touching: false, hovered: false };
    groups.push(group);
    if (clothes) {
      layers.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch' || mobileLayout.matches || group.hovered) return;
        group.hovered = true;
        group.hoverStart = group.variant;
        group.variant = 1 - group.variant;
        layers.classList.add('is-pointer-driven');
        paint();
      }, { signal: abort.signal });
      layers.addEventListener('pointerleave', () => {
        if (!group.hovered) return;
        group.hovered = false;
        group.variant = group.hoverStart;
        group.nextChange = nextChange();
        paint();
      }, { signal: abort.signal });
      layers.addEventListener('pointerdown', () => { if (mobileLayout.matches) group.touching = true; }, { signal: abort.signal });
      for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) layers.addEventListener(name, () => {
        group.touching = false;
        group.nextChange = nextChange();
      }, { signal: abort.signal });
    }
  }
  function nextChange() { return performance.now() + 1900 + Math.random() * 2600; }
  function paint() {
    row.dataset.variant = String(variant);
    groups.forEach(group => {
      const { figures, toggle, label } = group;
      const current = clothes ? group.variant : variant;
      figures.forEach((figure, index) => {
        const active = index === current;
        figure.classList.toggle('is-active', active);
        figure.inert = !active;
        figure.setAttribute('aria-hidden', String(!active));
      });
      toggle.textContent = clothes ? `${current ? 'Оборот' : 'Лицевая'} ↔` : `${current ? 'Чёрная' : 'Белая'} ↔`;
      toggle.setAttribute('aria-label', `${label}: показать ${clothes ? current ? 'лицевую сторону' : 'оборотную сторону' : current ? 'белую оклейку' : 'чёрную оклейку'}`);
    });
  }
  paint();
  Promise.all([...row.querySelectorAll('img')].map(img => img.decode().catch(() => {}))).then(() => { ready = true; });
  const visibility = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && clothes) groups.forEach(group => { group.nextChange = nextChange(); });
  }, { root });
  visibility.observe(row);
  const timer = setInterval(() => {
    if (!visible || !ready || document.hidden || reduced.matches || document.documentElement.hasAttribute('data-viewer-open') || row.contains(document.activeElement)) return;
    if (clothes) {
      const now = performance.now();
      let changed = false;
      for (const group of groups) if (!group.touching && !group.hovered && now >= group.nextChange) {
        group.layers.classList.remove('is-pointer-driven');
        group.variant = 1 - group.variant; group.nextChange = nextChange(); changed = true;
      }
      if (changed) paint();
    } else { variant = 1 - variant; paint(); }
  }, clothes ? 150 : 2400);
  return () => { clearInterval(timer); visibility.disconnect(); abort.abort(); swipeDisposers.forEach(dispose => dispose()); };
}
