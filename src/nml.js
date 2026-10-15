import { typography } from './typography.js?v=5';
import { motionGlyphs } from './nml-motion-glyphs.js';
import { createMedia } from './media.js?v=22';
import { createImageMarquee } from './image-marquee.js?v=5';
import { nmlArtwork, nmlPosters, nmlSocial, nmlColors } from './nml-data.js?v=6';

const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = typography(text);
  return node;
};
const art = (name, className = '') => {
  const img = make('img', className); img.src = `./assets/nml/${name}.svg`; img.alt = ''; img.draggable = false; return img;
};

export function createNML(scrollRoot = null) {
  const element = make('article', 'nml-case');
  element.setAttribute('aria-label', 'New Media Lab — айдентика');
  const abort = new AbortController();
  const disposers = [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, raf = 0;
  const sections = [];
  const on = (target, name, action, options = {}) => target.addEventListener(name, action, { ...options, signal: abort.signal });
  const caption = (title, aside) => {
    const h = make('h2', 'nml-caption'); h.append(make('span', '', title));
    if (aside) h.append(make('span', 'nml-caption-aside', aside));
    return h;
  };
  function block(title, className = '', aside = '') {
    const section = make('section', `nml-block ${className}`);
    section.setAttribute('aria-label', title); section.append(caption(title, aside));
    sections.push(section); element.append(section); return section;
  }
  function media(key) { return createMedia(nmlArtwork[key]); }

  const intro = make('header', 'nml-intro');
  const pause = make('button', 'nml-pause', 'Пауза анимации'); pause.type = 'button';
  on(pause, 'click', () => { paused = !paused; sync(); }); intro.append(pause); element.append(intro);

  // Original logo outlines from Figma; only their construction overlay is animated.
  const logos = block('Логотип / Две версии', 'nml-logos');
  let gridResetTimer;
  const gridToggle = make('button', 'nml-grid-toggle', 'Показать сетку');
  gridToggle.type = 'button'; gridToggle.setAttribute('aria-pressed', 'false');
  on(gridToggle, 'click', () => {
    clearTimeout(gridResetTimer);
    const pinned = logos.classList.toggle('is-grid-pinned');
    logos.classList.toggle('is-grid-hidden', !pinned);
    if (!pinned) gridResetTimer = setTimeout(() => logos.classList.remove('is-grid-hidden'), 3000);
    gridToggle.setAttribute('aria-pressed', String(pinned));
    gridToggle.textContent = pinned ? 'Скрыть сетку' : 'Показать сетку';
  });
  logos.querySelector('.nml-caption').append(gridToggle);
  for (const variant of ['horizontal', 'stacked']) {
    const wrapper = make('div', `nml-logo nml-logo-${variant}`);
    wrapper.append(media(`logo-${variant}`));
    const grid = make('div', 'nml-construction'); grid.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 7; i++) grid.append(make('i'));
    const label = make('span', 'nml-construction-label', 'Inter Medium / Исходные пропорции');
    grid.append(label); wrapper.append(grid); logos.append(wrapper);
  }

  const motion = block('Логотип в движении', 'nml-motion', 'Знак → Название → Система');
  const stage = make('div', 'nml-motion-stage');
  stage.setAttribute('role', 'img'); stage.setAttribute('aria-label', 'Звезда и NML разворачиваются в NEW MEDIA LAB, расходятся по углам и собираются обратно');
  const wordmark = make('div', 'nml-moving-word'); wordmark.setAttribute('aria-hidden', 'true');
  for (const [index, glyph] of motionGlyphs.entries()) {
    const box = make('span', `nml-motion-glyph ${glyph.initial ? 'is-initial' : 'is-expanding'}`);
    box.style.setProperty('--advance', `${glyph.advance}em`);
    box.style.setProperty('--glyph-width', `${glyph.width}em`);
    box.style.setProperty('--glyph-animation', `nml-letter-${index}`);
    const image = make('img'); image.src = glyph.src; image.alt = ''; image.draggable = false;
    box.append(image); wordmark.append(box);
  }
  stage.append(art('motion-star', 'nml-moving-star'), wordmark);
  motion.append(stage);

  const colors = block('Цвет / Палитра New Media Lab', 'nml-colors nml-wide');
  const palette = make('div', 'nml-palette');
  for (const color of nmlColors) {
    const cell = make('div', 'nml-color');
    const circle = make('div', 'nml-color-circle'); circle.style.background = color.hex;
    if (color.hex === '#FFFFFF') circle.classList.add('is-white');
    cell.append(circle, make('p', 'nml-color-code', `hex ${color.hex}\nrgb ${color.rgb}`), make('p', 'nml-color-name', color.name)); palette.append(cell);
  }
  colors.append(palette);

  const type = block('Типографика / Inter', 'nml-type', 'Движение при прокрутке');
  const weights = make('div', 'nml-weights');
  ['Inter Light', 'Inter Regular', 'Inter Semi Bold'].forEach(t => weights.append(make('span', '', t)));
  const specimen = make('div', 'nml-type-specimen'); specimen.setAttribute('aria-label', 'NML — три начертания Inter');
  for (const [i, letter] of [...'NML'].entries()) {
    const glyph = make('span', 'nml-type-letter', letter); glyph.style.fontWeight = [300, 400, 600][i]; specimen.append(glyph);
  }
  type.append(weights, specimen);

  const pacmans = block('Графический язык / Новые идеи', 'nml-pacmans nml-wide', 'Бегущая строка');
  const runway = make('div', 'nml-pacman-runway');
  const track = make('div', 'nml-pacman-track');
  for (let copy = 0; copy < 2; copy++) {
    const group = make('div', 'nml-pacman-group'); group.setAttribute('aria-hidden', 'true');
    for (let i = 1; i <= 4; i++) {
      const pac = make('div', `nml-pacman nml-pacman-${i}`);
      pac.append(art(`pacman-${i}`)); group.append(pac);
    }
    track.append(group);
  }
  runway.setAttribute('role', 'img'); runway.setAttribute('aria-label', 'Бегущая строка из четырёх оригинальных графических элементов'); runway.append(track); pacmans.append(runway);

  const rings = block('Графический язык / Ритм и орбиты', 'nml-rings');
  const ringRow = make('div', 'nml-pair'); ringRow.append(media('rings-blue'), media('rings-red')); rings.append(ringRow);

  const posters = block('Плакаты / Варианты графической системы', 'nml-posters');
  const marquee = createImageMarquee(nmlPosters, 'NML — лента плакатов. Стрелки влево и вправо');
  posters.append(marquee.element); disposers.push(marquee.dispose);

  const books = block('Обложки / Та самая книга для маркетолога', 'nml-books');
  const bookRow = make('div', 'nml-pair'); bookRow.append(media('book-color'), media('book-outline')); books.append(bookRow);

  const social = block('Социальные сети / Карточки и рубрики', 'nml-social');
  const socialGrid = make('div', 'nml-social-grid');
  for (const artwork of nmlSocial) socialGrid.append(createMedia(artwork));
  social.append(socialGrid);

  const website = block('Digital / Главная страница', 'nml-website'); website.append(media('website'));
  const footer = make('footer', 'nml-footer');
  const back = make('button', '', 'К началу ↑'); back.type = 'button';
  on(back, 'click', () => (scrollRoot || window).scrollTo({ top: 0, behavior: paused ? 'auto' : 'smooth' })); footer.append(back); element.append(footer);

  const visibility = new Map();
  function sync() {
    const suspended = paused || document.hidden || document.documentElement.hasAttribute('data-viewer-open');
    element.classList.toggle('nml-paused', suspended);
    pause.textContent = paused ? 'Включить анимацию' : 'Пауза анимации'; pause.setAttribute('aria-pressed', String(paused));
    sections.forEach(section => section.dataset.running = String(!suspended && visibility.get(section)));
    if (paused) specimen.style.setProperty('--type-stretch', '1'); else requestType();
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) visibility.set(entry.target, entry.isIntersecting);
    sync();
  }, { root: scrollRoot, rootMargin: '0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
  function updateType() {
    raf = 0;
    if (paused || document.hidden || !visibility.get(type)) return;
    const bounds = type.getBoundingClientRect(), rootTop = scrollRoot?.getBoundingClientRect().top || 0;
    const height = scrollRoot?.clientHeight || innerHeight;
    const progress = Math.max(0, Math.min(1, (height - (bounds.top - rootTop)) / (height + bounds.height)));
    // A continuous scroll-linked stretch, returning to Inter's original proportions.
    const stretch = 1.65 - Math.min(1, progress / .72) * .65;
    specimen.style.setProperty('--type-stretch', stretch.toFixed(4));
  }
  function requestType() { if (!raf) raf = requestAnimationFrame(updateType); }
  on(scrollRoot || window, 'scroll', requestType, { passive: true });
  on(window, 'resize', requestType, { passive: true });
  on(document, 'visibilitychange', sync);
  on(reduced, 'change', () => { paused = reduced.matches; sync(); });
  const viewer = new MutationObserver(sync); viewer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-viewer-open'] });
  sync();
  return { element, dispose() { clearTimeout(gridResetTimer); abort.abort(); observer.disconnect(); viewer.disconnect(); cancelAnimationFrame(raf); disposers.forEach(dispose => dispose()); } };
}
