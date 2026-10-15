import { createMedia } from './media.js?v=22';
import { createFloatingVideo } from './floating-video.js?v=5';
import { createMediaHeading } from './media-heading.js';

export function createStagePresentation(data, stage) {
  const element = document.createElement('section');
  element.className = 'stage-presentation';
  element.setAttribute('aria-label', 'Оформление сцены');
  const figures = data.media.map(createMedia);
  const screens = document.createElement('div');
  screens.className = 'stage-screen-layouts';
  screens.append(...figures.slice(1, 4));
  const anchor = document.createElement('div');
  anchor.className = 'registration-video-anchor';
  element.append(
    createMediaHeading('Раус сцены', 'Наружные коммуникации'), figures[0],
    createMediaHeading('Заставки на экран', 'Наружные коммуникации'), screens,
    createMediaHeading('Раус и заставки / в жизни', 'Наружные коммуникации'),
    anchor, ...figures.slice(4),
  );
  const dispose = createFloatingVideo({
    source: data.video, label: 'Сцена / видео заставки', stage, element, anchor,
    target: figures[4].querySelector('.media-frame'),
    scale: .35, overhang: .9, offset: 0, lift: 0,
  });
  return { element, dispose };
}
