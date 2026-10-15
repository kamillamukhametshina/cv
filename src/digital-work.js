import { createSlideshow } from './photowall.js?v=14';
import { createCycle, createCaseComparison, createSolarHero, createClubPattern, createClubBadge, createQrComparison } from './archive-case-interactions.js?v=5';
import { createMedia } from './media.js?v=22';
import { createImageMarquee } from './image-marquee.js?v=5';
import { createMediaHeading } from './media-heading.js';

// Block arrangements reference the same records used by the archive and viewer.
export function createDigitalWork(work, scrollRoot) {
  const element = document.createElement('div');
  element.className = `digital-work digital-work-${work.id}`;
  const cleanups = [];
  for (const block of work.blocks) {
    const special = { 'qr-comparison': () => createQrComparison(block, scrollRoot), cycle: () => createCycle(block.media, block.label, scrollRoot, block.interval), comparison: () => createCaseComparison(block, scrollRoot), 'solar-hero': () => createSolarHero(block.media, scrollRoot), 'mcc-pattern': () => createClubPattern(scrollRoot), 'mcc-badge': () => createClubBadge(block.media, scrollRoot) }[block.kind];
    if (special) { const content=special(); element.append(content.element); cleanups.push(content.dispose); continue; }
    if (block.kind === 'model') {
      const model=createSlideshow(block.media,1600,scrollRoot,true);
      model.element.classList.add('digital-object-model');
      if (block.label) model.element.prepend(createMediaHeading(block.label));
      model.element.setAttribute('aria-label','Перекрёсток — поворот яблока');
      const visibility=new IntersectionObserver(([entry])=>model.element.classList.toggle('is-model-visible',entry.isIntersecting),{root:scrollRoot});
      visibility.observe(model.element);
      element.append(model.element);cleanups.push(()=>{visibility.disconnect();model.dispose();});continue;
    }
    if (block.kind === 'marquee') {
      const marquee = createImageMarquee(block.media, `${work.title} — бегущая строка баннеров`);
      marquee.element.classList.add('digital-banners');
      element.append(marquee.element);
      cleanups.push(marquee.dispose);
      continue;
    }
    const row = document.createElement('section');
    row.className = `digital-row digital-row-${block.kind}`;
    if (work.id === 'phoenix-online' || (work.id === 'perekrestok' && block.kind === 'three')) {
      row.classList.add('digital-row-equal-height');
      row.style.setProperty('--equal-media-ratio', Math.max(...block.media.map(item => item.width / item.height)));
    }
    for (const item of block.media) {
      const figure = createMedia(item);
      if (work.id === 'free-collection' && block.kind === 'two' && item.type === 'video') {
        const poster = block.media.find(media => media.type === 'image');
        if (poster) {
          const frame = figure.querySelector('.media-frame');
          frame.style.setProperty('--ratio', `${poster.width} / ${poster.height}`);
          figure.classList.add('poster-sized-video');
        }
      }
      if (work.id === 'perekrestok' || work.id === 'phoenix-online' || work.id === 'free-collection') {
        const caption = figure.querySelector('figcaption');
        if (caption) figure.prepend(caption);
      }
      if (block.kind === 'phone' || (block.kind === 'phones-poster' && item.type === 'video')) figure.classList.add('digital-phone');
      row.append(figure);
    }
    if (block.colors) {
      const palette = document.createElement('div');
      palette.className = 'recycle-palette';
      palette.setAttribute('aria-label', 'Цветовая палитра');
      for (const hex of block.colors) {
        const color = document.createElement('div'); color.className = 'recycle-color';
        const circle = document.createElement('div'); circle.className = 'recycle-color-circle'; circle.style.background = hex;
        const code = document.createElement('p'); code.className = 'recycle-color-code';
        const rgb = hex.slice(1).match(/../g).map(value=>parseInt(value,16)).join(', ');
        code.textContent = `hex ${hex}\nrgb ${rgb}`;
        color.append(circle, code); palette.append(color);
      }
      row.append(palette);
    }
    element.append(row);
  }
  return { element, dispose() { cleanups.forEach(dispose => dispose()); } };
}
