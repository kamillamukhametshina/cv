import { setupAnalytics } from './analytics.js?v=2';
import { setupMobileRails } from './mobile-enhancements.js?v=3';
import { mountFrameCover } from './frame-cover.js';
import { frameCoverData } from './frame-cover-data.js';
import { createResume } from './resume.js?v=6';
import { imageSource, coverVideoSource } from './mobile-media.js';
import { createFlyHome } from './fly-home.js?v=10';
import { spectrumVisibleSections } from './spectrum-sections.js';
import { setupMobileNavigation } from './mobile-navigation.js?v=7';
import { setupSidebarLayout } from './sidebar-layout.js?v=9';
import { createDigitalWork } from './digital-work.js?v=15';
import { createNML } from './nml.js?v=13';
import { createFresh } from './fresh.js?v=8';
import { createFDate } from './f-date.js?v=8';
import { createCitydrive } from './citydrive.js?v=11';
import { createDocumentArchive } from './document-archive.js?v=3';
import { createImageMarquee } from './image-marquee.js?v=5';
import { createAdvertalyzeRbi } from './advertalyze-rbi.js?v=3';
import { setupTechnicalUI } from './technical-ui.js?v=4';
import { createMediaHeading } from './media-heading.js';
import { createPosterWall } from './poster-wall.js?v=11';
import { createStickerPack } from './sticker-pack.js?v=8';
import { createPhotowall } from './photowall.js?v=14';
import { createStagePresentation } from './stage-presentation.js?v=8';
import { createNavigationStickers } from './navigation-stickers.js?v=6';
import { createBadges } from './badges.js?v=8';
import { createRegistration } from './registration.js?v=15';
import { createComparison } from './comparison.js?v=7';
import { mobileLayout, mediaScrollRoot } from './responsive.js';
import { createPosterIntro } from './poster-intro.js?v=9';
import { projects, workTypes, workItems, profile } from './data.js?v=84';
import { normalizeState, readState, stateURL, defaultState, worksForType } from './state.js?v=81';
import { createMedia, createGallery, observeVideos } from './media.js?v=22';
import { setupInteractions } from './interactions.js?v=19';
import { setupImageViewer, galleryForState } from './viewer.js?v=30';
import { typography } from './typography.js?v=5';


const list = document.querySelector('#project-list');
const filters = document.querySelector('#filters');
const info = document.querySelector('#project-info');
const stage = document.querySelector('#stage');
const media = document.querySelector('#media-stage');
const mediaControls = document.querySelector('#media-controls');
const decoration = document.querySelector('#decoration');
const home = document.querySelector('#home');
const announcement = document.querySelector('#announcement');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const viewer = setupImageViewer({ media, stage, getGallery: galleryFor });
const technicalUI = setupTechnicalUI();
const interactions = setupInteractions(stage, { isScrollLocked: () => viewer.isOpen });
const rows = new Map();
const filterButtons = new Map();
let state = readState(location.search, location.hash);
if (mobileLayout.matches && state.view === 'projects' && state.selectedProject === 'spectrum' && !new URLSearchParams(location.search).has('internal') && !location.hash.startsWith('#/projects/')) state.selectedInternalFilter = 'all';
let revision = 0;
let stopVideos = () => {};
let stopMobileRails = () => {};
let stopFlyHome = () => {};
let stopResume = () => {};
let previousWorksState = { ...defaultState(), view: 'projects' };
let sidebarLayout = null;
let stopPoster = () => {};
let stopComparison = () => {};
let stopRegistration = () => {};
let stopNavigation = () => {};
let stopStagePresentation = () => {};
let stopPhotowall = () => {};
let stopStickerPack = () => {};
let stopPosterWall = () => {};
let stopAdvertalyzeRbi = () => {};
let stopCitydrive = () => {};
let stopFDate = () => {};
let stopFresh = () => {};
let stopNML = () => {};
let stopMarquee = () => {};
let animations = [];
let pendingFocus = null;
let renderedState = null;

const indexPanel = document.querySelector('.index');
const mobileNavigation = setupMobileNavigation({ home, indexPanel, headerNav: document.querySelector('.header-nav'), mobileLayout, info });
const analytics = setupAnalytics(() => { mobileNavigation.close(false); viewer.close(); });
mobileLayout.addEventListener('change', () => { viewer.close(); renderedState = null; syncShell(); transition(true); });

function textElement(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = typography(text, { afterColon: tag === 'dd' });
  element.dataset.proximity = '';
  if (className) element.className = className;
  return element;
}

for (const project of projects) {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'project-row';
  button.append(
    textElement('span', `${String(project.number).padStart(2, '0')}. ${project.title}`, 'project-name'),
    textElement('span', project.shortType, 'project-type'),
  );
  button.querySelectorAll('[data-proximity]').forEach(element => delete element.dataset.proximity);
  button.addEventListener('click', () => navigate({ mode: 'project', selectedProject: project.id, selectedType: 'Все', selectedWorkItem: null, selectedInternalFilter: null, view: 'projects' }));
  if (!project.ready) {
    button.title = 'Материалы проекта будут добавлены позже';
    button.setAttribute('aria-label', `${project.title} — материалы будут добавлены позже`);
  }
  li.append(button);
  list.append(li);
  rows.set(project.id, button);
}
// Keep the legacy all-types state readable, without an extra UI category.
for (const type of workTypes.filter(type => type !== 'Все')) {
  const button = textElement('button', type, 'filter');
  button.type = 'button';
  button.addEventListener('click', () => navigate({ mode: 'type', selectedType: type, selectedProject: null, selectedWorkItem: null, selectedInternalFilter: null, view: 'projects' }));
  filters.append(button);
  filterButtons.set(type, button);
}

function contactLink(hostId, label, href, unavailableText) {
  const element = textElement(href ? 'a' : 'span', label, href ? '' : 'unavailable');
  if (href) {
    element.href = href;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
  } else {
    element.setAttribute('aria-disabled', 'true');
    element.title = unavailableText;
    element.setAttribute('aria-label', `${label}: ${unavailableText}`);
  }
  document.getElementById(hostId).append(element);
}
const resumeLink = textElement('a', 'Резюме');
resumeLink.href = stateURL({ ...defaultState(), view:'resume' }, location.href);
resumeLink.addEventListener('click', event => interceptPlainClick(event, () => {
  if (state.view === 'resume') navigate(previousWorksState, resumeLink);
  else { previousWorksState = { ...state, view:'projects' }; navigate({ view:'resume' }, stage); }
}));
document.getElementById('resume-link').append(resumeLink);
contactLink('telegram-link', 'Telegram', profile.telegram, 'Контакт пока не добавлен');

function syncShell() {
  const isHome = state.view === 'home' && mobileLayout.matches;
  const isResume = state.view === 'resume';
  const inProjects = !isHome && !isResume;
  document.documentElement.classList.toggle('is-resume-page', isResume);
  resumeLink.textContent = isResume ? 'Работы' : 'Резюме';
  resumeLink.href = isResume ? stateURL(previousWorksState, location.href) : stateURL({ ...defaultState(), view:'resume' }, location.href);
  document.documentElement.classList.toggle('is-fly-home', isHome);
  document.documentElement.classList.toggle('nml-page', inProjects && state.mode === 'project' && state.selectedProject === 'new-media-lab');
  document.querySelector('.skip-link').dataset.target = isResume || document.documentElement.classList.contains('nml-page') ? '#stage' : '#project-info';
  document.querySelector('.skip-link').href = stateURL(state, location.href);
  // Resolve the same case background regardless of entry point or screen size.
  const selectedWork = state.mode === 'type' ? workItems.find(item => item.id === state.selectedWorkItem) : null;
  const backgroundProject = state.mode === 'project' ? state.selectedProject : selectedWork?.projectId;
  document.documentElement.classList.toggle('white-project-page', inProjects && ['advertalyze', 'citydrive'].includes(backgroundProject));
  const related = state.mode === 'type' && inProjects
    ? workItems.find(item => item.id === state.selectedWorkItem)?.projectId : null;
  for (const project of projects) {
    const button = rows.get(project.id);
    button.setAttribute('aria-current', String(inProjects && state.mode === 'project' && project.id === state.selectedProject));
    button.dataset.related = String(project.id === related);
  }
  for (const [type, button] of filterButtons) {
    button.setAttribute('aria-pressed', String(inProjects && state.mode === 'type' && type === state.selectedType));
  }
  syncInternalFilters();
  home.href = stateURL({ ...defaultState(), view: 'home' }, location.href);
  interactions.refresh();
}

function syncDeadline(project) {
  info.scrollTop = 0;
  info.querySelector('.project-deadline')?.remove();
  info.querySelector('.section-description')?.remove();
  const section = project.internalFilters?.find(filter => filter.id === state.selectedInternalFilter);
  if(section?.description) info.append(textElement('p', section.description, 'section-description project-intro'));
  const value = project.internalFilters?.find(filter => filter.id === state.selectedInternalFilter)?.deadline || project.deadline;
  if (!value) return;
  const deadline = textElement('p', `{${value.replace(/[{}]/g, '')}}`, 'project-deadline');
  deadline.removeAttribute('data-proximity');
  info.prepend(deadline);
}
function projectContent(project) {
  info.append(textElement('p', project.intro || project.title, 'project-intro'));
  const facts = document.createElement('dl');
  facts.className = 'project-facts';
  for (const [label, value] of [['Роль:', project.role], ['Задача:', project.task], ['Цифры:', project.stats]]) {
    if (!value) continue;
    const group = document.createElement('div');
    group.append(textElement('dt', label), textElement('dd', value));
    facts.append(group);
  }
  info.append(facts);
  syncDeadline(project);
  if (project.internalFilters?.length) {
    const nav = document.createElement('nav');
    nav.className = 'internal-filters';
    nav.setAttribute('aria-label', 'Разделы проекта');
    const sectionFilters = project.id === 'spectrum' && mobileLayout.matches ? [{ id:'all',label:'Все' }, ...project.internalFilters] : project.internalFilters;
    for (const filter of sectionFilters) {
      const button = textElement('button', filter.label, 'internal-filter');
      button.type = 'button';
      button.dataset.internalFilter = filter.id;
      button.addEventListener('click', () => navigate({ selectedInternalFilter: filter.id }));
      nav.append(button);
    }
    mediaControls.append(nav);
    mediaControls.hidden = false;
  }
  const content = document.createElement('div');
  content.id = 'project-content';
  content.className = 'internal-content';
  media.append(content);
  fillProjectMedia(project, content);
  syncInternalFilters();
  if (project.decorativeObject) {
    const image = document.createElement('img');
    Object.assign(image, project.decorativeObject, { alt: '', loading: 'lazy', decoding: 'async' });
    decoration.append(image);
  }
  stage.setAttribute('aria-label', `Материалы проекта ${project.title}`);
  info.setAttribute('aria-label', project.title);
  document.title = `${project.title} — ${profile.name}`;
  announcement.textContent = typography(`Выбран проект: ${project.title}`);
}
function fillProjectMedia(project, host, skipPoster = false) {
  if (project.poster && !skipPoster && (project.nml || project.fresh || project.citydrive || project.fDate) && state.selectedInternalFilter === project.internalFilters[0].id) {
    const intro = createPosterIntro(project, mediaScrollRoot(stage));
    host.append(intro.element);
    stopPoster = intro.dispose;
  }
  if (project.nml) {
    if (state.selectedInternalFilter === 'presentation') {
      const section = project.internalFilters.find(filter => filter.id === 'presentation');
      const gallery = createGallery(section.media);
      gallery.classList.add('nml-presentation');
      gallery.setAttribute('aria-label', 'New Media Lab — презентация');
      host.append(gallery);
      return;
    }
    const content = createNML(mediaScrollRoot(stage));
    host.append(content.element); stopNML = content.dispose; return;
  }
  if (project.fresh) {
    const content = createFresh(project.internalFilters.find(section => section.id === state.selectedInternalFilter), mediaScrollRoot(stage));
    host.append(content.element);
    stopFresh = content.dispose;
    appendNextCase(project, host);
    return;
  }
  if (project.fDate) {
    const content = createFDate(project.fDate, state.selectedInternalFilter, mediaScrollRoot(stage));
    host.append(content.element);
    stopFDate = content.dispose;
    appendNextCase(project, host);
    return;
  }
  if (project.citydrive) {
    const city = createCitydrive(project.citydrive, state.selectedInternalFilter, stage);
    host.append(city.element);
    stopCitydrive = city.dispose;
    appendNextCase(project, host);
    return;
  }
  const sectionFilter = project.id === 'spectrum' && (!mobileLayout.matches || state.selectedInternalFilter === 'all') ? 'outdoor' : state.selectedInternalFilter;
  const visibleSections = project.id === 'spectrum' ? spectrumVisibleSections(state.selectedInternalFilter, mobileLayout.matches) : null;
  const showSection = id => visibleSections ? visibleSections.includes(id) : sectionFilter === id;
  if (project.poster && !skipPoster && (!visibleSections || !mobileLayout.matches || state.selectedInternalFilter === 'all')) {
    const intro = createPosterIntro(project, mediaScrollRoot(stage));
    host.append(intro.element);
    stopPoster = intro.dispose;
  }
  if (project.comparison && (!project.comparison.internalFilter || showSection(project.comparison.internalFilter))) {
    const comparison = createComparison(project.comparison, mediaScrollRoot(stage));
    comparison.element.dataset.section = 'outdoor';
    host.append(comparison.element);
    stopComparison = comparison.dispose;
  }
  const selected = project.internalFilters?.find(filter => filter.id === sectionFilter);
  const content = selected?.content || [];
  host.append(...content.map(text => textElement('p', text, 'internal-copy')));
  const items = selected?.media || (project.films ? project.media.filter(item => !project.films.includes(item) && !project.rbi?.includes(item) && !project.marquee?.includes(item) && !project.photodump?.includes(item) && !project.vacuum?.includes(item) && !project.videoPair?.includes(item) && !project.news?.includes(item) && !project.finale?.includes(item)) : project.media);
  if (project.films) host.append(advertalyzeFilmSection(project.films));
  if (project.rbi) {
    const rbi = createAdvertalyzeRbi(project.rbi, stage);
    host.append(rbi.element);
    stopAdvertalyzeRbi = rbi.dispose;
  }
  if (project.marquee) {
    const marquee = createImageMarquee(project.marquee);
    host.append(marquee.element);
    stopMarquee = marquee.dispose;
  }
  if (project.photodump) host.append(advertalyzePhotodumpSection(project.photodump));
  if (project.vacuum) host.append(advertalyzeVacuumSection(project.vacuum));
  if (project.videoPair) {
    const pair = document.createElement('section');
    pair.className = 'advertalyze-video-pair';
    pair.setAttribute('aria-label', 'Advertalyze — видеокреативы');
    pair.append(...project.videoPair.map(createMedia));
    host.append(pair);
  }
  if (project.news) host.append(advertalyzeNewsSection(project.news));
  if (project.archive) {
    const archive = document.createElement('section'); archive.className = 'advertalyze-archive-composition';
    const clown = createMedia(project.news[6]); clown.classList.add('advertalyze-clown');
    archive.append(clown, createDocumentArchive(project.archive, (doc, button) => viewer.openDocument(doc, button)));
    host.append(archive);
  }
  if (project.finale) {
    const finale = document.createElement('section');
    finale.className = 'advertalyze-finale';
    finale.setAttribute('aria-label', 'Advertalyze — заключительные видео');
    const pair = document.createElement('div');
    pair.className = 'advertalyze-video-pair';
    pair.append(...project.finale.slice(0, 2).map(createMedia));
    const third = createMedia(project.finale[2]);
    const ending = createMedia(project.finale[3]);
    ending.classList.add('advertalyze-ending');
    finale.append(pair, third, ending);
    host.append(finale);
  }
  if (project.registration && showSection(project.registration.internalFilter)) {
    const registration = createRegistration(project.registration, stage, project.badges);
    if (!host.querySelector('[data-section=outdoor]')) registration.element.dataset.section = 'outdoor';
    host.append(registration.element);
    stopRegistration = registration.dispose;
    if (project.badgeMedia?.length) host.append(badgeDocumentation(project.badgeMedia));
  } else if ((project.photowall && sectionFilter === 'photowall') || (project.stickerPack && sectionFilter === 'stickers') || (project.posterWall && sectionFilter === 'posters')) {
    // The dedicated section is rendered below with its timed slideshows.
  } else if (project.badges && sectionFilter === 'badges') {
    const badges = createBadges(project.badges);
    host.append(badges.element);
    stopRegistration = badges.dispose;
    if (project.badgeMedia?.length) host.append(badgeDocumentation(project.badgeMedia));
  } else if (project.id !== 'spectrum' && items.length && !(project.navigationMedia && sectionFilter === 'navigation')) host.append(createGallery(items));
  if (project.navigationStickers && showSection('outdoor')) {
    const rows = project.navigationStickers.map(data => createNavigationStickers(data, mediaScrollRoot(stage)));
    host.append(...rows.map(row => row.element));
    stopNavigation = () => rows.forEach(row => row.dispose());
    if (project.navigationMedia?.length) host.append(navigationDocumentation(project.navigationMedia));
  }
  if (project.stagePresentation && showSection(project.stagePresentation.internalFilter)) {
    const presentation = createStagePresentation(project.stagePresentation, stage);
    host.append(presentation.element);
    stopStagePresentation = presentation.dispose;
  }
  if (project.photowall && showSection('photowall')) {
    const photowall = createPhotowall(project.photowall, mediaScrollRoot(stage));
    photowall.element.dataset.section = 'photowall';
    host.append(photowall.element);
    stopPhotowall = photowall.dispose;
  }
  if (project.stickerPack && showSection('stickers')) {
    const stickers = createStickerPack(project.stickerPack, mediaScrollRoot(stage));
    stickers.element.dataset.section = 'stickers';
    host.append(stickers.element);
    stopStickerPack = stickers.dispose;
  }
  if (project.posterWall && showSection('posters')) {
    const posters = createPosterWall(project.posterWall, mediaScrollRoot(stage));
    posters.element.dataset.section = 'posters';
    host.append(posters.element);
    stopPosterWall = posters.dispose;
    if (project.posterDocumentation?.length) host.append(posterDocumentation(project.posterDocumentation));
  }
  if (!project.ready) host.append(textElement('p', 'Материалы проекта будут добавлены позже.', 'empty-state'));
  appendNextCase(project, host);
}
function appendNextCase(project, host) {
  if (!['citydrive', 'bitrix24', 'fresh-auto', 'f-date-eat'].includes(project.id)) return;
  const sections = project.internalFilters;
  const index = sections.findIndex(section => section.id === state.selectedInternalFilter);
  const next = sections[(index + 1) % sections.length];
  const link = textElement('a', 'Смотреть следующий проект', 'next-case');
  link.href = stateURL({ ...state, selectedInternalFilter: next.id }, location.href);
  link.dataset.proximity = '';
  link.append(textElement('span', `${next.label} →`, 'next-case-label'));
  link.addEventListener('click', event => interceptPlainClick(event, () => navigate({ selectedInternalFilter: next.id }, stage)));
  host.append(link);
}
function advertalyzeNewsSection(items) {
  const section = document.createElement('section');
  section.className = 'advertalyze-news';
  section.setAttribute('aria-label', 'Advertalyze — инфоповоды для контента');
  const staircase = document.createElement('div');
  staircase.className = 'advertalyze-news-staircase';
  staircase.append(...items.slice(0, 6).map(createMedia));
  section.append(staircase);
  return section;
}
function advertalyzeVacuumSection(items) {
  const section = document.createElement('section');
  section.className = 'advertalyze-vacuum';
  section.setAttribute('aria-label', 'Advertalyze — пылесос и ковёр');
  const left = document.createElement('div');
  left.className = 'advertalyze-vacuum-art';
  const vacuum = createMedia(items[0]);
  vacuum.classList.add('advertalyze-vacuum-sticker');
  left.append(vacuum, createMedia(items[1]));
  const phone = createMedia(items[2]);
  phone.classList.add('advertalyze-vacuum-phone');
  section.append(left, phone);
  return section;
}
function advertalyzePhotodumpSection(items) {
  const section = document.createElement('section');
  section.className = 'advertalyze-photodump';
  section.setAttribute('aria-label', 'Advertalyze — как работает фотодамп');
  const cards = document.createElement('div');
  cards.className = 'advertalyze-photodump-grid';
  cards.append(...items.slice(0, 6).map(createMedia));
  const phone = createMedia(items[6]);
  phone.classList.add('advertalyze-photodump-phone');
  section.append(cards, phone);
  return section;
}
function advertalyzeFilmSection(items) {
  const section = document.createElement('section');
  section.className = 'advertalyze-films';
  section.setAttribute('aria-label', 'Advertalyze — кинопремьеры');
  const strip = document.createElement('div');
  strip.className = 'advertalyze-film-strip';
  strip.append(...items.filter(item => item.type === 'image').map(createMedia));
  const phone = createMedia(items.find(item => item.type === 'video'));
  phone.classList.add('advertalyze-phone');
  section.append(strip, phone);
  return section;
}
function posterDocumentation(items) {
  const section = document.createElement('section');
  section.className = 'poster-documentation';
  section.setAttribute('aria-label', 'Плакаты и наклейки / реализация');
  const video = createMedia(items[0]);
  const photos = document.createElement('div');
  photos.className = 'poster-documentation-photos';
  photos.append(...items.slice(1).filter(item => !item.ending).map(createMedia));
  section.append(createMediaHeading('Наклейки и плакаты / в жизни'), photos, video);
  section.append(...items.filter(item => item.ending).map(createMedia));
  return section;
}
function navigationDocumentation(items) {
  const section = document.createElement('section');
  section.className = 'navigation-documentation';
  section.setAttribute('aria-label', 'Навигация в пространстве');
  const heading = document.createElement('p'); heading.className = 'media-heading';
  heading.append(textElement('span', 'Навигация / реализация'), textElement('span', 'Наружные коммуникации', 'media-heading-category'));
  const gallery = createGallery(items);
  gallery.querySelectorAll('figcaption').forEach(caption => caption.remove());
  section.append(heading, gallery);
  return section;
}
function badgeDocumentation(items) {
  const section = document.createElement('section');
  section.className = 'badge-documentation';
  section.setAttribute('aria-label', 'Бейджи в жизни');
  const heading = document.createElement('p');
  heading.className = 'media-heading';
  heading.append(textElement('span', 'Бейджи / в жизни'), textElement('span', 'Наружные коммуникации', 'media-heading-category'));
  const gallery = createGallery(items);
  gallery.querySelectorAll('figcaption').forEach(caption => caption.remove());
  section.append(heading, gallery);
  return section;
}
function syncInternalFilters() {
  mediaControls.querySelectorAll('[data-internal-filter]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.internalFilter === state.selectedInternalFilter));
  });
}
function fillTypeMedia(host) {
  info.scrollTop = 0;
  mediaControls.replaceChildren();mediaControls.hidden=true;
  const works = worksForType(state.selectedType);
  const selected = works.find(item => item.id === state.selectedWorkItem);
  info.replaceChildren();
  if (selected?.id === 'free-collection') {
    const content=createDigitalWork(selected,mediaScrollRoot(stage));
    const detail=document.createElement('article');detail.className='work-detail work-detail-custom';
    detail.append(content.element);host.append(detail);stopMarquee=content.dispose;
    document.title=`Произвольное — ${profile.name}`;
    stage.setAttribute('aria-label','Произвольное: графика, анимация и видео');
    return;
  }
  if (selected) {
    const detail = document.createElement('article');
    detail.className = 'work-detail';
    const header = document.createElement('header');
    header.className = 'work-detail-header';
    const back = textElement('button', '← Вернуться назад', 'work-back');
    back.type = 'button';
    back.addEventListener('click', () => navigate({ selectedWorkItem: null }));
    const project = projects.find(p => p.id === selected.projectId);
    if(selected.deadline) info.append(textElement('p', `{${selected.deadline}}`, 'project-deadline'));
    if(selected.intro) info.append(textElement('p', selected.intro, 'project-intro'));
    const facts = document.createElement('dl'); facts.className = 'project-facts work-copy';
    for(const [label,value] of [['Роль:',selected.role],['Задача:',selected.hideTask ? '' : (selected.task || selected.description)],['Цифры:',selected.stats]]) {
      if(!value) continue;
      const row=document.createElement('div'); row.append(textElement('dt',label),textElement('dd',value)); facts.append(row);
    }
    info.append(facts);
    const workNav = document.createElement('nav');
    workNav.className = 'internal-filters work-switcher';
    workNav.setAttribute('aria-label', `Другие работы: ${state.selectedType}`);
    for (const work of works) {
      const label = projects.find(p=>p.id===work.projectId)?.title;
      const button = textElement('button', label && label !== work.title ? `${label} / ${work.title}` : work.title, 'work-filter');
      button.type = 'button'; button.setAttribute('aria-pressed', String(work.id === selected.id));
      button.addEventListener('click', () => navigate({selectedWorkItem:work.id}));
      workNav.append(button);
    }
    mediaControls.append(workNav, back);mediaControls.hidden = false;
    if (project) {
      const link = textElement('a', 'Смотреть в проекте →', 'work-project-link');
      const destination = normalizeState({ mode: 'project', selectedProject: project.id, selectedInternalFilter: selected.internalFilterId });
      link.href = stateURL(destination, location.href);
      link.addEventListener('click', event => interceptPlainClick(event, () => navigate(destination)));
      info.append(link);
    }
    detail.append(header);
    if (selected.blocks) {
      const content = createDigitalWork(selected, mediaScrollRoot(stage));
      detail.classList.add('work-detail-custom');
      detail.append(content.element);
      stopMarquee = content.dispose;
    } else detail.append(createGallery(selected.media));
    host.append(detail);
    if (renderedState) pendingFocus = info;
    document.title = `${selected.title} — ${profile.name}`;
    stage.setAttribute('aria-label', `Работа: ${selected.title}`);
  } else if (works.length) {
    const coverDisposers = [];
    stopMarquee = () => coverDisposers.forEach(dispose => dispose());
    info.replaceChildren();
    const overview = document.createElement('div');
    overview.className = 'type-overview';
    const archiveHeader = document.createElement('header');
    archiveHeader.className = 'work-archive-header';
    const countLabel = new Intl.PluralRules('ru').select(works.length);
    archiveHeader.append(textElement('span', `${works.length} ${{one:'работа',few:'работы',many:'работ',other:'работ'}[countLabel]}`));
    host.append(archiveHeader);
    for (const item of works) {
      const project = projects.find(p => p.id === item.projectId);
      const button = document.createElement(item.ready === false ? 'article' : 'button');
      button.className = 'work-preview archive-file';
      button.classList.toggle('is-pending', item.ready === false);
      if (item.ready !== false) {
        button.type = 'button'; button.dataset.workItem = item.id;
        if (!frameCoverData[item.id]) button.addEventListener('click', () => navigate({ selectedWorkItem: item.id }));
      }
      button.setAttribute('aria-label', project ? `${item.title} — ${project.title}` : item.title);
      const index = String(workItems.indexOf(item) + 1).padStart(3, '0');
      const kind = item.workKind || (item.types.includes('Презентации') ? 'Slides' : item.types[0]);
      button.append(textElement('span', `File ${index} / ${kind}`, 'archive-file-meta'));
      const cover = document.createElement('span'); cover.className = 'work-cover';
      cover.classList.toggle('is-presentation', item.types.includes('Презентации'));
      if (!item.cover) {
        cover.classList.add('is-placeholder');
      } else if (item.cover.type === 'image' || (item.cover.poster && !item.animatedCover)) {
        const image = document.createElement('img');
        image.src = imageSource(item.cover.type === 'image' ? item.cover.src : item.cover.poster);
        image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
        if (item.coverPosition) image.style.objectPosition = item.coverPosition;
        cover.append(image);
      } else {
        const video = document.createElement('video');
        video.dataset.src = coverVideoSource(item.cover.src); video.dataset.autoplay = 'true'; video.preload = 'none'; video.muted = true; video.loop = true; video.playsInline = true; if(item.cover.poster)video.poster=imageSource(item.cover.poster);
        video.tabIndex = -1; video.setAttribute('aria-hidden', 'true'); cover.append(video);
      }
      if(item.coverFit && cover.firstElementChild) cover.firstElementChild.style.objectFit=item.coverFit;
      if (frameCoverData[item.id]) coverDisposers.push(mountFrameCover(button, cover, () => navigate({ selectedWorkItem: item.id }), mobileLayout, frameCoverData[item.id]));
      button.append(cover, textElement('span', item.title, 'archive-file-title'));
      button.append(textElement('span', project?.title || item.types.join(' / '), 'work-source'));
      button.append(textElement('span', item.ready === false ? 'Материалы пока не добавлены' : `Материалы: ${item.media.length}`, 'archive-file-count'));
      button.append(textElement('span', item.ready === false ? 'карточка проекта' : 'кликнуть и посмотреть ↗', 'archive-file-action'));

      overview.append(button);
    }
    host.append(overview);
    document.title = `${state.selectedType} — ${profile.name}`;
    stage.setAttribute('aria-label', `Работы: ${state.selectedType}`);
  } else host.append(textElement('p', 'В этом разделе пока нет опубликованных работ.', 'empty-state'));
}
function typeContent() {
  const content = document.createElement('div');
  content.id = 'type-content';
  media.append(content);
  fillTypeMedia(content);
  info.setAttribute('aria-label', state.selectedType);
  announcement.textContent = typography(`Работы: ${state.selectedType}`);
}

const contentObserver = new ResizeObserver(() => interactions.refresh());
contentObserver.observe(media);
contentObserver.observe(stage);

function galleryFor(target) {
  return galleryForState(renderedState || state, projects, workItems, target.closest('.work-preview')?.dataset.workItem);
}

async function transition(initial = false) {
  viewer.close();
  const currentRevision = ++revision;
  animations.forEach(animation => animation.cancel());
  const animate = !initial && !reducedMotion.matches;
  const internalHost = document.getElementById('project-content');
  const sameView = renderedState?.view === 'projects' && state.view === 'projects';
  const internalOnly = internalHost && sameView && state.mode === 'project' && renderedState?.mode === 'project'
    && renderedState.selectedProject === state.selectedProject;
  const typeHost = document.getElementById('type-content');
  const workOnly = typeHost && sameView && state.mode === 'type' && renderedState?.mode === 'type'
    && renderedState.selectedType === state.selectedType;
  if (internalOnly && !initial && state.selectedProject === 'spectrum' && !mobileLayout.matches) {
    renderedState = { ...state };
    syncInternalFilters();
    jumpToSection(!initial);
    showTransitionFeedback();
    analytics.page(state, document.title);
    return;
  }
  interactions.stopScroll();
  const hosts = internalOnly ? [internalHost] : workOnly ? [typeHost] : [info, media, decoration];
  const animatedHosts = hosts.filter(host => host !== info);
  if (animate && !mobileLayout.matches) {
    animations = animatedHosts.map(host => host.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(8px)' },
    ], { duration: 180, easing: 'ease-in', fill: 'forwards' }));
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  }
  if (currentRevision !== revision) return;
  stopMobileRails();
  stopFlyHome();
  stopFlyHome = () => {};
  stopResume();
  stopResume = () => {};
  stopVideos();
  stopPoster();
  stopComparison();
  stopRegistration();
  stopNavigation();
  stopStagePresentation();
  stopNML();
  stopNML = () => {};
  stopFresh();
  stopFresh = () => {};
  stopFDate();
  stopFDate = () => {};
  stopCitydrive();
  stopCitydrive = () => {};
  stopMarquee();
  stopMarquee = () => {};
  stopAdvertalyzeRbi();
  stopAdvertalyzeRbi = () => {};
  stopPosterWall();
  stopPosterWall = () => {};
  stopStickerPack();
  stopStickerPack = () => {};
  stopPhotowall();
  stopPhotowall = () => {};
  stopStagePresentation = () => {};
  stopNavigation = () => {};
  stopRegistration = () => {};
  stopComparison = () => {};
  stopPoster = () => {};
  hosts.forEach(host => host.replaceChildren());
  if (!internalOnly && !workOnly) {
    mediaControls.replaceChildren();
    mediaControls.hidden = true;
  }
  document.documentElement.classList.toggle('is-type-archive', state.view === 'projects' && state.mode === 'type' && !state.selectedWorkItem);
  stage.scrollTop = 0;
  if (internalOnly) {
    const project = projects.find(project => project.id === state.selectedProject);
    syncDeadline(project);
    fillProjectMedia(project, internalHost, !initial && ['bitrix24', 'new-media-lab', 'fresh-auto', 'citydrive', 'f-date-eat'].includes(project.id));
    syncInternalFilters();
    announcement.textContent = typography(project.internalFilters?.find(filter => filter.id === state.selectedInternalFilter)?.label || project.title);
  } else if (workOnly) {
    fillTypeMedia(typeHost);
      announcement.textContent = typography(workItems.find(item => item.id === state.selectedWorkItem)?.title || state.selectedType);
  } else if (state.view === 'resume') {
    const resume = createResume(profile.resume);
    media.append(resume.element);
    stopResume = resume.dispose;
    document.title = `Резюме — ${profile.name}`;
    stage.setAttribute('aria-label', 'Резюме Камиллы Мухаметшиной');
    announcement.textContent = 'Резюме';
  } else if (state.view === 'home' && mobileLayout.matches) {
    const flyHome = createFlyHome();
    media.append(flyHome.element);
    stopFlyHome = flyHome.dispose;
    document.title = `${profile.name} — цифровой архив`;
    stage.setAttribute('aria-label', 'Главная страница');
    announcement.textContent = 'Цифровой архив';
  } else if (state.mode === 'type') typeContent();
  else {
    const project = projects.find(project => project.id === state.selectedProject);
    if (project) projectContent(project);

  }
  media.querySelector(':scope > .back-to-top')?.remove();
  if (mobileLayout.matches && state.view !== 'home' && state.view !== 'resume') {
    const top = textElement('button', 'К началу ↑', 'back-to-top'); top.type = 'button';
    top.addEventListener('click', () => { window.scrollTo({ top:0,behavior:reducedMotion.matches ? 'instant' : 'smooth' }); info.focus({ preventScroll:true }); });
    media.append(top);
  }
  stopMobileRails = setupMobileRails(document.querySelector('.archive'));
  renderedState = { ...state };
  analytics.page(state, document.title);
  if (!mobileLayout.matches && state.mode === 'project' && state.selectedProject === 'spectrum' && state.view === 'projects' && state.selectedInternalFilter !== 'outdoor') requestAnimationFrame(() => { if (currentRevision === revision) jumpToSection(false); });
  if (!initial) showTransitionFeedback();
  if (mobileLayout.matches && !initial) {
    mobileNavigation.close(false);
    const target = internalOnly || workOnly ? mediaControls.hidden ? stage : mediaControls : info.getClientRects().length ? info : stage;
    window.scrollTo({ top: state.view === 'home' ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 20), behavior: 'instant' });
  }
  stopVideos = observeVideos(media, mediaScrollRoot(stage));
  interactions.refresh();
  animations.forEach(animation => animation.cancel());
  animations = [];
  if (animate) {
    animations = animatedHosts.map((host, index) => host.animate(mobileLayout.matches ? [
      { opacity: 0 }, { opacity: 1 },
    ] : [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: mobileLayout.matches ? 160 : 240, delay: mobileLayout.matches ? 0 : index === 1 ? 30 : 0, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'both' }));
  }
  Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => {
    if (currentRevision === revision) {
      animations.forEach(animation => animation.cancel());
      animations = [];
      interactions.refresh();
    }
  });
  if (pendingFocus) {
    (pendingFocus.getClientRects().length ? pendingFocus : stage).focus({ preventScroll: true });
    pendingFocus = null;
  }
}
function navigate(patch, focus = null) {
  if (mobileLayout.matches && patch.view !== 'home' && patch.selectedProject === 'spectrum' && patch.selectedInternalFilter == null) patch = { ...patch, selectedInternalFilter:'all' };
  if (mobileNavigation.close(false)) focus ||= info;
  const next = normalizeState({ ...state, ...patch });
  if (JSON.stringify(next) === JSON.stringify(state)) {
    if (state.mode === 'project' && state.selectedProject === 'spectrum' && state.view === 'projects' && patch.selectedInternalFilter && !mobileLayout.matches) { jumpToSection(true); showTransitionFeedback(); return; }
    if (mobileLayout.matches) {
      mobileNavigation.close(false);
      (info.getClientRects().length ? info : stage).scrollIntoView({ block: 'start' });
      focus?.focus({ preventScroll: true });
    }
    return;
  }
  state = next;
  pendingFocus = focus;
  history.pushState(null, '', stateURL(state, location.href));
  syncShell();
  transition();
}
function jumpToSection(smooth) {
  const target = media.querySelector(`[data-section="${state.selectedInternalFilter}"]`);
  if (!target) return;
  interactions.stopScroll();
  const behavior = smooth && !reducedMotion.matches ? 'smooth' : 'instant';
  if (mobileLayout.matches) {
    mobileNavigation.close(false);
    window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - 24, behavior });
  } else stage.scrollTo({ top: stage.scrollTop + target.getBoundingClientRect().top - stage.getBoundingClientRect().top - 32, behavior });
  announcement.textContent = projects.find(p => p.id === state.selectedProject)?.internalFilters.find(f => f.id === state.selectedInternalFilter)?.label || '';
}
function showTransitionFeedback() {
  if (state.view === 'resume') return;
  if (state.view === 'home' && mobileLayout.matches) return;
  if (state.mode === 'type') {
    const work = workItems.find(item => item.id === state.selectedWorkItem);
    technicalUI.show(work ? 'File found' : 'Filter applied', work?.title || state.selectedType, work ? work.media.length : worksForType(state.selectedType).length);
    return;
  }
  const project = projects.find(p => p.id === state.selectedProject);
  const section = project?.internalFilters?.find(f => f.id === state.selectedInternalFilter);
  technicalUI.show(section ? 'Section found' : 'Project opened', section?.label || project?.title || '', section?.media.length ?? project?.media.length ?? 0);
}
function interceptPlainClick(event, callback) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  callback();
}
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  const target = document.querySelector(event.currentTarget.dataset.target);
  target?.scrollIntoView({block:'start'});
  if (target) { target.tabIndex = -1; target.focus({preventScroll:true}); }
});
home.addEventListener('click', event => interceptPlainClick(event, () => { stage.scrollTop = 0; if (mobileLayout.matches) window.scrollTo(0, 0); navigate({ ...defaultState(), view: 'home' }, home); }));
window.addEventListener('popstate', () => {
  mobileNavigation.close(false);
  state = readState(location.search, location.hash);
  pendingFocus = null;
  history.replaceState(null, '', stateURL(state, location.href));
  syncShell();
  transition();
});
// Cancel any active animation immediately if the system switches to reduced motion.
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) transition(true); });
history.replaceState(null, '', stateURL(state, location.href));
syncShell();
transition(true);
sidebarLayout = setupSidebarLayout(projects, workItems);
