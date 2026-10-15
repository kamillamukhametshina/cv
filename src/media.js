import { registerSoundVideo, silenceVideo } from './site-sound.js?v=3';
import { galleryModules } from './gallery.js';
import { typography } from './typography.js?v=4';
import { imageSource } from './mobile-media.js';
import { mobileLayout } from './responsive.js';
export const videoSource = item => item.safariSrc && typeof navigator !== 'undefined' && /Apple/.test(navigator.vendor) ? item.safariSrc : item.src;
const mediaItems = new WeakMap();
export const mediaItemFor = element => mediaItems.get(element);
// Media renderer is shared by all four layouts; there are no project-specific branches.
export function createMedia(item) {
  const figure = document.createElement('figure');
  figure.className = `media-item slot-${item.slot || 'additional'}`;
  if (item.type === 'video' && Math.abs(item.width / item.height - 1) < .05) figure.className += ' is-square-video';
  if (item.gridColumn) {
    figure.dataset.module = '';
    figure.style.setProperty('--module-column', item.gridColumn);
    figure.style.setProperty('--module-row', item.gridRow || 'auto');
  }
  const frame = document.createElement('div');
  frame.className = 'media-frame';
  frame.style.setProperty('--ratio', item.ratio || `${item.width} / ${item.height}`);
  frame.style.setProperty('--fit', item.fit || 'cover');
  frame.style.setProperty('--position', item.position || 'center');
  const media = document.createElement(item.type === 'video' ? 'video' : 'img');
  mediaItems.set(media, item);
  media.width = item.width;
  media.height = item.height;
  if (item.type === 'video') {
    if (!item.allowSound) silenceVideo(media);
    media.controls = item.controls || !item.autoplay;
    if (item.autoplay) {
      media.muted = true; media.loop = true; media.dataset.autoplay = 'true';
      if(item.allowSound) media.dataset.nativeAutoplay='true';
    }
    media.playsInline = true;
    media.preload = 'none';
    media.setAttribute('aria-label', item.alt);
    if (item.poster) media.poster = imageSource(item.poster);
    // Source is attached only when the video approaches the visible stage.
    media.dataset.src = videoSource(item);
  } else {
    media.alt = typography(item.alt);
    media.dataset.viewable = '';
    media.tabIndex = 0;
    media.setAttribute('aria-haspopup', 'dialog');
    media.loading = 'lazy';
    media.decoding = 'async';
    media.src = imageSource(item.src);
  }
  let retried = false;
  media.addEventListener('error', () => {
    if (!retried && item.type !== 'video' && media.isConnected) {
      retried = true;
      media.src = item.src;
      return;
    }
    if (item.type === 'video' && item.poster) {
      const fallback = document.createElement('img');
      fallback.src = imageSource(item.poster); fallback.alt = typography(item.alt);
      frame.replaceChildren(fallback);
      return;
    }
    const error = document.createElement('p');
    error.className = 'media-error';
    error.dataset.proximity = '';
    error.textContent = typography(`Не удалось загрузить материал. ${item.alt}`);
    frame.replaceChildren(error);
  });
  frame.append(media);
  figure.append(frame);
  if (item.caption) {
    const caption = document.createElement('figcaption');
    caption.dataset.proximity = '';
    caption.textContent = typography(item.caption);
    figure.append(caption);
  }
  return figure;
}

export function createGallery(items) {
  const gallery = document.createElement('div');
  gallery.className = 'composition curated-gallery';
  for (const module of galleryModules(items)) {
    if (module.group) {
      const group = document.createElement('section');
      group.className = 'gallery-series';
      group.setAttribute('aria-label', module.label);
      const row = document.createElement('div');
      row.className = 'gallery-series-items';
      row.style.setProperty('--series-count', Math.min(module.items.length, 4));
      row.append(...module.items.map(galleryFigure));
      group.append(row);
      gallery.append(group);
    } else {
      const figure = galleryFigure(module.items[0]);
      figure.classList.toggle('gallery-wide', module.wide);
      gallery.append(figure);
    }
  }
  return gallery;
}
function galleryFigure(item) {
  const figure = createMedia(item);
  figure.style.setProperty('--gallery-fit', item.galleryFit || 'contain');
  if (!item.caption) {
    const caption = document.createElement('figcaption');
    caption.textContent = typography(item.alt);
    figure.append(caption);
  }
  return figure;
}

export function observeVideos(container, scrollRoot) {
  const videos = [...container.querySelectorAll('video:not([data-self-managed])')];
  const visible = new Set();
  const sound = new Map(videos.filter(video => video.dataset.autoplay).map(video => [video, registerSoundVideo(video, video.dataset.src || video.src)]));
  function syncPlayback() {
    const suspended = document.hidden || document.documentElement.hasAttribute('data-viewer-open');
    for (const video of videos) {
      const play = !suspended && visible.has(video);
      if (video.dataset.autoplay) {
        sound.get(video).setVisible(play);
      } else if (!play) video.pause();
    }
  }
  const preload = new IntersectionObserver(entries => {
    for (const { target: video, isIntersecting } of entries) if (isIntersecting && video.dataset.src) {
      video.preload = 'auto';
      video.src = video.dataset.src;
      delete video.dataset.src;
      preload.unobserve(video);
      syncPlayback();
    }
  }, { root: scrollRoot, rootMargin: `${mobileLayout.matches ? 160 : Math.max(400, innerHeight)}px` });
  const imagePreload = new IntersectionObserver(entries => {
    for (const { target: image, isIntersecting } of entries) if (isIntersecting) {
      image.loading = 'eager';
      image.decode().catch(() => {});
      imagePreload.unobserve(image);
    }
  }, { root: scrollRoot, rootMargin: `${mobileLayout.matches ? 300 : Math.max(400, innerHeight)}px` });
  container.querySelectorAll('img').forEach(image => imagePreload.observe(image));
  const playback = new IntersectionObserver(entries => {
    for (const { target: video, isIntersecting, intersectionRatio } of entries) {
      if (isIntersecting && intersectionRatio > 0) visible.add(video); else visible.delete(video);
    }
    syncPlayback();
  }, { root: scrollRoot, threshold: [0, .01] });
  videos.forEach(video => {
    video.addEventListener('loadeddata', syncPlayback);
    preload.observe(video); playback.observe(video);
  });
  document.addEventListener('visibilitychange', syncPlayback);
  document.addEventListener('portfolio-viewer-change', syncPlayback);
  return () => {
    preload.disconnect(); playback.disconnect(); imagePreload.disconnect();
    sound.forEach(controller => controller.dispose());
    document.removeEventListener('visibilitychange', syncPlayback);
    document.removeEventListener('portfolio-viewer-change', syncPlayback);
    videos.forEach(video => {
      video.removeEventListener('loadeddata', syncPlayback);
      video.autoplay = false; video.pause();
      if (mobileLayout.matches) { video.removeAttribute('src'); video.load(); }
    });
  };
}
