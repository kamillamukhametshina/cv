import { silenceVideo } from './site-sound.js?v=3';
import { mobileLayout } from './responsive.js';
import { mediaItemFor, videoSource } from './media.js?v=22';
import { typography } from './typography.js?v=5';
import { setupHorizontalDrag } from './horizontal-drag.js';

export const galleryMedia = items => items.filter(item => item.type === 'image' || item.type === 'video');
export function galleryForState(state, projects, workItems, previewId) {
  if (state.view !== 'projects') return [];
  if (state.mode === 'type') return workItems.find(item => item.id === (state.selectedWorkItem || previewId))?.media || [];
  const project = projects.find(project => project.id === state.selectedProject);
  if (project?.id === 'spectrum') return project.media;
  return project?.internalFilters?.find(filter => filter.id === state.selectedInternalFilter)?.media || project?.media || [];
}
export const wrapIndex = (index, length) => length ? ((index % length) + length) % length : 0;
export const viewerSource = item => item.highResSrc || (item.type === 'video' ? videoSource(item) : item.src);

export function setupImageViewer({ media, stage, getGallery }) {
  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', 'Просмотр материалов');
  const content = document.createElement('div');
  content.className = 'viewer-content';
  const frame = document.createElement('div');
  frame.className = 'viewer-frame';
  const viewport = document.createElement('div');
  viewport.className = 'viewer-viewport';
  viewport.append(frame);
  const documentTitle = document.createElement('p');
  documentTitle.className = 'viewer-document-title';
  documentTitle.hidden = true;
  const navigation = document.createElement('nav');
  navigation.className = 'viewer-navigation';
  navigation.setAttribute('aria-label', 'Листание изображений');
  const previous = document.createElement('button');
  previous.type = 'button'; previous.textContent = '←'; previous.setAttribute('aria-label', 'Предыдущее изображение');
  const next = document.createElement('button');
  next.type = 'button'; next.textContent = '→'; next.setAttribute('aria-label', 'Следующее изображение');
  const counter = document.createElement('span');
  counter.setAttribute('role', 'status');
  counter.setAttribute('aria-live', 'polite');
  const help = document.createElement('p');
  help.id = 'viewer-help'; help.className = 'sr-only';
  help.textContent = typography('Стрелки влево и вправо — листать. Escape или клик вне изображения — закрыть.');
  dialog.setAttribute('aria-describedby', help.id);
  const closeButton = document.createElement('button');
  closeButton.type = 'button'; closeButton.className = 'viewer-close';
  closeButton.textContent = 'Закрыть ×';
  closeButton.addEventListener('click', close);
  navigation.append(previous, counter, next, closeButton);
  content.append(documentTitle, viewport, navigation, help);
  dialog.append(content);
  document.body.append(dialog);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let items = [];
  let index = 0;
  let opener;
  let scrollPosition = 0;
  let documentPosition = 0;
  let revision = 0;
  let animation;
  let pendingAsset = null;

  function updateDocumentCounter() {
    if (!dialog.classList.contains('is-document') || !items.length) return;
    const readingLine = 110;
    let page = 0;
    [...frame.children].forEach((asset, position) => {
      if (asset.getBoundingClientRect().top <= readingLine) page = position;
    });
    counter.textContent = `${String(page + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  }
  dialog.addEventListener('scroll', updateDocumentCounter, { passive: true });

  function renderDocument() {
    ++revision;
    animation?.cancel();
    pendingAsset?.removeAttribute('src');
    pendingAsset = null;
    pauseCurrent();
    // Share the page ratio with the content width so the first page fits the viewport.
    content.style.setProperty('--document-ratio', items[0].width / items[0].height);
    frame.replaceChildren(...items.map((item, page) => {
      const asset = document.createElement('img');
      asset.className = 'viewer-asset';
      asset.width = item.width;
      asset.height = item.height;
      asset.alt = typography(item.alt);
      asset.decoding = 'async';
      asset.loading = page === 0 ? 'eager' : 'lazy';
      asset.src = viewerSource(item);
      return asset;
    }));
    previous.hidden = next.hidden = true;
    viewport.scrollTop = viewport.scrollLeft = 0;
    dialog.scrollTop = 0;
    updateDocumentCounter();
    viewport.focus({ preventScroll: true });
  }

  function notify(open) {
    document.documentElement.toggleAttribute('data-viewer-open', open);
    document.dispatchEvent(new CustomEvent('portfolio-viewer-change'));
  }
  function pauseCurrent() { frame.querySelector('video')?.pause(); }
  function finishClose() {
    ++revision;
    animation?.cancel();
    pendingAsset?.removeAttribute('src');
    pendingAsset = null;
    pauseCurrent();
    frame.replaceChildren();
    items = [];
    notify(false);
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
    stage.scrollTop = scrollPosition;
    if (mobileLayout.matches) window.scrollTo(0, documentPosition);
  }
  function close() {
    if (!dialog.open) return;
    dialog.close();
    finishClose();
  }
  async function render(initial = false, direction = 1) {
    const current = ++revision;
    animation?.cancel();
    pendingAsset?.removeAttribute('src');
    const item = items[index];
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    previous.hidden = next.hidden = items.length < 2;
    const asset = document.createElement(item.type === 'video' ? 'video' : 'img');
    pendingAsset = asset;
    asset.className = 'viewer-asset';
    asset.width = item.width; asset.height = item.height;
    if (item.type === 'video') {
      if (!item.allowSound) silenceVideo(asset);
      else asset.controls = true;
      asset.loop = true; asset.playsInline = true;
      asset.preload = 'metadata'; asset.setAttribute('aria-label', typography(item.alt));
      if (item.poster) asset.poster = item.poster;
    } else {
      asset.alt = typography(item.alt); asset.decoding = 'async';
    }
    asset.src = viewerSource(item);
    // At most one current asset and one pending asset; reuse the browser cache.
    const ready = item.type === 'image' ? asset.decode().catch(() => {}) : Promise.resolve();
    if (!initial && !reducedMotion.matches) {
      animation = frame.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-direction * 6}px)` }], { duration: 110, fill: 'forwards', easing: 'ease-in' });
      await Promise.all([ready, animation.finished.catch(() => {})]);
    } else await ready;
    if (current !== revision || !dialog.open) { asset.removeAttribute('src'); return; }
    pauseCurrent();
    const half = item.half === 0 || item.half === 1;
    frame.style.setProperty('--viewer-ratio', item.width / item.height / (half ? 2 : 1));
    if (half) {
      asset.style.objectFit = 'cover';
      asset.style.objectPosition = item.half ? 'right center' : 'left center';
    }
    frame.replaceChildren(asset);
    viewport.scrollTop = viewport.scrollLeft = 0;
    dialog.scrollTop = 0;
    pendingAsset = null;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    previous.hidden = next.hidden = items.length < 2;
    animation?.cancel();
    if (item.type === 'video') asset.play().catch(() => {});
    if (!reducedMotion.matches) {
      animation = frame.animate([{ opacity: 0, transform: `translateX(${direction * 6}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 140, easing: 'ease-out' });
    }
  }
  function step(direction) {
    if (dialog.classList.contains('is-document') || items.length < 2) return;
    index = wrapIndex(index + direction, items.length);
    render(false, direction);
  }
  function open(target) {
    const item = mediaItemFor(target);
    if (!item || item.type !== 'image') return;
    items = galleryMedia(getGallery(target));
    index = items.indexOf(item);
    if (index < 0) return;
    dialog.classList.remove('is-document', 'is-zoomed');
    documentTitle.hidden = true;
    viewport.removeAttribute('tabindex');
    viewport.removeAttribute('role');
    viewport.removeAttribute('aria-label');
    navigation.setAttribute('aria-label', 'Листание изображений');
    help.textContent = typography('Стрелки влево и вправо — листать. Escape или клик вне изображения — закрыть.');
    dialog.setAttribute('aria-label', 'Просмотр материалов');
    show(target);
  }
  function openDocument(doc, target) {
    if (!doc.pages?.length) return;
    items = doc.pages;
    index = 0;
    dialog.classList.add('is-document');
    dialog.classList.remove('is-zoomed');
    documentTitle.textContent = doc.title;
    documentTitle.hidden = false;
    dialog.setAttribute('aria-label', doc.title);
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', 'Страницы PDF');
    navigation.setAttribute('aria-label', 'Управление документом');
    help.textContent = typography('Прокручивайте документ вниз для чтения следующих страниц. Escape — закрыть.');
    show(target);
  }
  function show(target) {
    opener = target;
    scrollPosition = stage.scrollTop;
    documentPosition = window.scrollY;
    notify(true);
    dialog.showModal();
    stage.scrollTop = scrollPosition;
    if (dialog.classList.contains('is-document')) renderDocument();
    else render(true);
  }
  // Delegation survives project/filter renders; no per-image click listeners.
  media.addEventListener('click', event => {
    const target = event.target.closest('img[data-viewable]');
    if (target) open(target);
  });
  media.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('img[data-viewable]')) {
      event.preventDefault(); open(event.target);
    }
  });
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  setupHorizontalDrag(viewport, {
    enabled: event => mobileLayout.matches && dialog.open && !dialog.classList.contains('is-document') && !event.target.closest('video'),
    end: delta => { if (Math.abs(delta) >= 32) step(delta < 0 ? 1 : -1); },
  });
  frame.addEventListener('click', event => {
    if(event.target.closest('video')) return;
    if (dialog.classList.contains('is-document') || dialog.classList.contains('is-zoomed')) return;
    const bounds = frame.getBoundingClientRect();
    step(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1);
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('keydown', event => {
    if (!dialog.classList.contains('is-document') && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault(); event.stopPropagation(); step(event.key === 'ArrowRight' ? 1 : -1);
    }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
  });
  document.addEventListener('visibilitychange', () => {
    const video = frame.querySelector('video');
    if (!video) return;
    if (document.hidden) video.pause(); else if (dialog.open) video.play().catch(() => {});
  });
  return { close, openDocument, get isOpen() { return dialog.open; } };
}
