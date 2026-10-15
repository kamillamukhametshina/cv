import { createMedia, createGallery } from './media.js?v=22';
import { createImageMarquee } from './image-marquee.js?v=5';
import { createSlideshow } from './photowall.js?v=14';
import { mediaScrollRoot, mobileLayout } from './responsive.js';

const text = (tag, value, className) => {
  const element = document.createElement(tag);
  element.textContent = value;
  if (className) element.className = className;
  return element;
};
function intro(copy, bullets) {
  const header = document.createElement('header');
  header.className = 'citydrive-intro';
  const list = document.createElement('ul');
  list.append(...bullets.map(value => text('li', value)));
  header.append(text('p', copy), list);
  return header;
}
function caption(value) { return text('p', value[0].toUpperCase() + value.slice(1), 'citydrive-caption'); }
function cityMedia(item) {
  const figure = createMedia(item);
  const heading = figure.querySelector('figcaption');
  if (heading) figure.prepend(heading);
  return figure;
}

function createPostcard(items, scrollRoot, label = 'Открытка к велкомпаку блоггерам') {
  const element = document.createElement('section');
  element.className = 'citydrive-postcard';
  element.setAttribute('aria-label', `${label} — две стороны`);
  const scene = document.createElement('div'); scene.className = 'postcard-scene';
  const card = document.createElement('div'); card.className = 'postcard-turn';
  const sides = items.map(createMedia);
  card.append(...sides); scene.append(card);
  element.append(caption(label), scene);
  scene.style.aspectRatio = `${items[0].width} / ${items[0].height}`;
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer, back = false, visible = false;
  const show = value => {
    back = value; card.classList.toggle('is-back', back);
    sides.forEach((side, i) => {
      side.inert = i !== Number(back);
      side.setAttribute('aria-hidden', String(i !== Number(back)));
    });
  };
  function sync() {
    clearInterval(timer);
    if (visible && !element.contains(document.activeElement) && !document.hidden && !reduced.matches && !document.documentElement.hasAttribute('data-viewer-open')) timer = setInterval(() => show(!back), 1500);
  }
  const turn = text('button', 'Перевернуть ↻', 'postcard-control'); turn.type = 'button';
  turn.addEventListener('click', () => { show(!back); sync(); }, { signal: abort.signal });
  element.append(turn);
  element.addEventListener('focusin', sync, { signal: abort.signal });
  element.addEventListener('focusout', () => queueMicrotask(sync), { signal: abort.signal });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { root: scrollRoot });
  observer.observe(element);
  document.addEventListener('portfolio-viewer-change', sync, { signal: abort.signal });
  document.addEventListener('visibilitychange', sync, { signal: abort.signal });
  reduced.addEventListener('change', sync, { signal: abort.signal });
  show(false);
  return { element, dispose() { clearInterval(timer); observer.disconnect(); abort.abort(); } };
}
function createPhotos(items) {
  const element = document.createElement('section');
  element.className = 'citydrive-process';
  for (const item of items) {
    const step = document.createElement('div');
    step.className = 'citydrive-process-step';
    step.append(cityMedia(item));
    element.append(step);
  }
  return element;
}
function createBadge(items, stage) {
  const show = createSlideshow(items, 1200, mediaScrollRoot(stage), true);
  show.element.classList.add('citydrive-badge');
  const element = document.createElement('section'); element.className = 'citydrive-sticker';
  element.append(caption('Стикер'), show.element);
  const abort = new AbortController(); let previous = null, distance = 0;
  function onScroll() {
    if (mobileLayout.matches) return;
    const y = mobileLayout.matches ? window.scrollY : stage.scrollTop;
    const delta = previous === null ? 0 : y - previous; previous = y;
    const rect = element.getBoundingClientRect();
    if (rect.top > innerHeight || rect.bottom < 0 || document.documentElement.hasAttribute('data-viewer-open')) return;
    distance += delta;
    if (Math.abs(distance) > 100) { show.change(Math.sign(distance)); distance = 0; }
  }
  for (const root of [stage, window]) root.addEventListener('scroll', onScroll, { passive: true, signal: abort.signal });
  return { element, dispose() { abort.abort(); show.dispose(); } };
}
export function createCitydrive(data, section, stage) {
  const element = document.createElement('div'); element.className = `citydrive-content citydrive-${section}`;
  const disposables = [];
  const add = component => { element.append(component.element); disposables.push(component); };
  if (section === 'kroshevo') {
    element.append(intro('{Крошево} — гастрономический фестиваль капусты в Боровичах. Помогала оформлять пресс-тур.', ['Открытки', 'Пдф-инструкцию/путеводитель', 'Макет наклейки и оклейка конусов 60 шт. (да-да, прям ручками)']));
    add(createPostcard(data.postcard, mediaScrollRoot(stage)));
    const life = cityMedia(data.postcardVideo); life.classList.add('citydrive-postcard-life'); element.append(life);
    const guide = document.createElement('section'); guide.className = 'citydrive-guide';
    const pages = document.createElement('div'); pages.className = 'citydrive-guide-pages'; pages.append(...data.guide.map(createMedia));
    guide.append(caption('Пдф-инструкцию/путеводитель'), pages);
    const cones = cityMedia(data.cones); cones.classList.add('citydrive-cones-video'); element.append(guide, cones);
    const finalCone = cityMedia(data.coneFinal); finalCone.classList.add('citydrive-cone'); element.append(finalCone); element.append(createPhotos(data.photos));
  } else if (section === 'outline') {
    const hero = document.createElement('section'); hero.className = 'citydrive-outline-hero';
    const art = createMedia(data.hero), phone = createMedia(data.phone);
    art.classList.add('citydrive-outline-art'); phone.classList.add('citydrive-outline-phone');
    hero.append(caption('Карточка-анонс для ТГ-канала Ситидрайв'), art, phone); element.append(hero);
    const marquee = createImageMarquee(data.covers, 'Ситидрайв × OUTLINE — варианты обложек для плейлиста. Прокрутка влево и вправо');
    marquee.element.prepend(caption('варианты обложек для плейлиста')); add(marquee);
    const pair = document.createElement('section'); pair.className = 'citydrive-outline-pack'; pair.append(cityMedia(data.pack), cityMedia(data.card)); element.append(pair);
    add(createBadge(data.badge, stage));
  } else {
    const other = data.otherContent;
    element.append(intro('{День каршеринга} {Мини-шеринг} {Фестиваль Петшоп дейс} {Ситидрайв × PURPUR} {Рыболовный выезд / не состоялся}', ['Информационные таблички', 'Стойки для пончиков', 'Рекламные материалы', 'Обложки для соцсетей и сторис в приложении']));
    add(createPostcard(other.postcard, mediaScrollRoot(stage), 'Открытка Ситидрайв × PURPUR'));
    const hero = document.createElement('section'); hero.className = 'citydrive-outline-hero';
    const art = cityMedia(other.hero), phone = cityMedia(other.phone);
    art.classList.add('citydrive-outline-art'); phone.classList.add('citydrive-outline-phone');
    hero.append(art, phone); element.append(hero);
    const row = (items, className) => { const section = document.createElement('section'); section.className = className; section.append(...items.map(cityMedia)); element.append(section); };
    row(other.stands, 'citydrive-other-stands');
    row(other.layouts, 'citydrive-other-layouts');
    for (const item of [other.life, other.donuts]) { const figure = cityMedia(item); figure.classList.add('citydrive-other-single'); element.append(figure); }
    element.append(cityMedia(other.windshield));
    if (other.eventPhotos?.length) row(other.eventPhotos, 'citydrive-other-wide-pair');
    row(other.bottom, 'citydrive-other-wide-pair');
    const last = cityMedia(other.chillVideo); last.classList.add('citydrive-other-last'); element.append(last);
    row(other.fishing, 'citydrive-other-fishing');
  }
  return { element, dispose() { disposables.forEach(component => component.dispose()); } };
}
