import { createFloatingVideo } from './floating-video.js?v=5';
import { createBadges } from './badges.js?v=8';
import { createMedia } from './media.js?v=22';
import { typography } from './typography.js?v=5';
export function createRegistration(data, stage, badges = []) {
  const element = document.createElement('section');
  element.className = 'registration-content';
  const figures = data.media.map((item) => {
    const figure = createMedia(item);
    const caption = document.createElement('figcaption');
    caption.className = 'media-heading';
    const title = document.createElement('span'); title.textContent = typography(item.alt);
    const category = document.createElement('span'); category.className = 'media-heading-category'; category.textContent = typography(data.category);
    caption.append(title, category); figure.prepend(caption);
    return figure;
  });
  const anchor = document.createElement('div'); anchor.className = 'registration-video-anchor';
  const realization = document.createElement('div');
  realization.className = 'registration-realization';
  realization.append(figures[1]);
  const hanging = badges.length ? createBadges(badges) : null;
  if (hanging) realization.append(hanging.element);
  element.append(figures[0], anchor, realization);
  const stopVideo = createFloatingVideo({
    source: data.video, label: 'Регистрация / видео реализации', stage, element,
    target: figures[0].querySelector('.media-frame'), anchor,
  });
  return { element, dispose() { hanging?.dispose(); stopVideo(); } };
}
