import { projectCopy, bitrixSectionCopy } from './site-copy.js';
import { createWorkItems, workTypes, typeContexts } from './work-items.js?v=20';
export { workTypes, typeContexts };
import { nmlSections } from './nml-data.js?v=6';
import { freshSections } from './fresh-content.js?v=7';
import { fDateContent } from './f-date-data.js?v=3';
import { citydriveContent } from './citydrive-data.js?v=6';
import { advertalyzeArchive } from './advertalyze-archive-data.js';
import { advertalyzeFinale } from './advertalyze-finale-data.js?v=3';
import { advertalyzeNews } from './advertalyze-news-data.js?v=3';
import { advertalyzeVideoPair } from './advertalyze-video-pair-data.js';
import { advertalyzeVacuum } from './advertalyze-vacuum-data.js';
import { advertalyzePhotodump } from './advertalyze-photodump-data.js';
import { advertalyzeMarquee } from './advertalyze-marquee-data.js';
import { advertalyzeRbi } from './advertalyze-rbi-data.js?v=3';
import { advertalyzeFilms } from './advertalyze-films-data.js';
import { assetPreviews } from './asset-previews.js';
import { spectrumPosterDocumentation } from './poster-documentation-data.js?v=2';
import { spectrumPosterWall } from './poster-wall-data.js';
import { spectrumStickerPack } from './sticker-pack-data.js';
const projectPosters = {
  spectrum: { src: './assets/posters/spectrum.webp', aspect: 750 / 860 },
  advertalyze: { src: './assets/posters/advertalyze.webp', aspect: .7, crop: [.19, .025, .62, .95] },
  citydrive: { src: './assets/posters/citydrive-cones.png', aspect: 595 / 842 },
  bitrix24: { src: './assets/posters/bitrix24.webp', aspect: 595 / 842 },
  'f-date-eat': { src: './assets/posters/f-date-couple.png', aspect: 709 / 798 },
  'fresh-auto': { src: './assets/posters/fresh-service.png', aspect: 984 / 1392 },
  'new-media-lab': { src: './assets/posters/nml-trends.png', aspect: 1055 / 1491 },
};
import { spectrumInternalFilters } from './spectrum-experiment.js?v=4';
// Slides stay in numeric order: 01 left, 02 right, 03 left on the next row.
const presentationSlides = (folder, label, count, { root = 'bitrix24', width = 1920, height = 1080, videos = {} } = {}) => Array.from({ length: count }, (_, index) => {
  const number = index + 1;
  const video = videos[number];
  return {
    type: video ? 'video' : 'image',
    src: `./assets/${root}/${folder}/${String(number).padStart(2, '0')}.${video ? 'mp4' : 'webp'}`,
    width: video?.width || width, height: video?.height || height, ratio: '16 / 9', fit: 'contain',
    ...(video ? { autoplay: true } : {}), alt: `${label} — слайд ${number}`,
  };
});

// Единственный источник контента. Пути — относительно editorial-v3/index.html.
// ready:false = строка индекса с пустым состоянием; данные не импортируются из v1/v2.

export const profile = {
  name: 'Камилла Мухаметшина',
  intro: 'Мультидисциплинарный дизайнер.',
  paragraphs: [
    'Делаю визуальные коммуникации: от креативов для социальных сетей до оформления событий и спецпроектов.',
    'Обычно работаю в сжатые сроки. Хорошо делаю быстрые задачи.',
    'Здесь — избранные материалы проектов: фотографии, digital-макеты и печатный дизайн.',
  ],
  resume: './assets/about/resume-design.pdf',
  telegram: 'https://t.me/kamillamukhametshina',
};

export const projects = [
  {
    id: 'spectrum', number: 1, title: 'Спектрум', shortType: 'Ивент',
    deadline: 'Срок реализации: 8 дней',
    stickerPack: spectrumStickerPack,
    posterWall: spectrumPosterWall,
    posterDocumentation: spectrumPosterDocumentation,
    photowall: {
      media: [
        {
                "type": "image",
                "src": "./assets/spectrum-photowall/model-right.png",
                "width": 1448,
                "height": 1086,
                "alt": "Фотозона / модель — слева",
                "fit": "contain"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-photowall/model-front.png",
                "width": 1448,
                "height": 1086,
                "alt": "Фотозона / модель — спереди",
                "fit": "contain"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-photowall/model-left.png",
                "width": 1448,
                "height": 1086,
                "alt": "Фотозона / модель — справа",
                "fit": "contain"
        },
        {
                "type": "video",
                "src": "./assets/spectrum-photowall/photowall-video.mp4",
                "width": 1080,
                "height": 1350,
                "alt": "Фотозона / видео реализации",
                "fit": "contain",
                "autoplay": true
        },
        {
                "type": "image",
                "src": "./assets/spectrum-photowall/photo-616.png",
                "width": 4096,
                "height": 2730,
                "alt": "Фотозона / гости с наградами",
                "fit": "contain"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-photowall/photo-642.png",
                "width": 4096,
                "height": 2731,
                "alt": "Фотозона / гран-при",
                "fit": "contain"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-photowall/photo-399.png",
                "width": 4096,
                "height": 2730,
                "alt": "Фотозона / гости в мерче",
                "fit": "contain"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-photowall/photo-606.png",
                "width": 4096,
                "height": 2731,
                "alt": "Фотозона / гости фестиваля",
                "fit": "contain"
        }
]
    },
    stagePresentation: {
      internalFilter: 'outdoor',
      video: './assets/spectrum-stage/stage-video.mp4',
      media: [
        {
                "type": "image",
                "src": "./assets/spectrum-stage/banner.png",
                "width": 3407,
                "height": 569,
                "alt": "Сцена / фронтальный баннер"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-stage/screen-pillars.png",
                "width": 1107,
                "height": 622,
                "alt": "Экран / цветовые полосы"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-stage/screen-partners.png",
                "width": 1107,
                "height": 622,
                "alt": "Экран / партнёры фестиваля"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-stage/screen-glow.png",
                "width": 1107,
                "height": 622,
                "alt": "Экран / градиентная заставка"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-stage/stage-live.png",
                "width": 3406,
                "height": 2434,
                "alt": "Сцена / ведущие и оформление"
        },
        {
                "type": "image",
                "src": "./assets/spectrum-stage/presenter.png",
                "width": 4118,
                "height": 2746,
                "alt": "Сцена / выступление ведущего"
        }
],
    },
    navigationMedia: [
      {
            "type": "image",
            "src": "./assets/spectrum-navigation/floor-spectrum.png",
            "width": 1086,
            "height": 1448,
            "gallerySpan": 1,
            "galleryFit": "cover",
            "alt": "Напольная навигация Спектрум"
      },
      {
            "type": "image",
            "src": "./assets/spectrum-navigation/floor-mads.png",
            "width": 1086,
            "height": 1448,
            "gallerySpan": 1,
            "galleryFit": "cover",
            "alt": "Точка роста mads / навигация"
      },
      {
            "type": "image",
            "src": "./assets/spectrum-navigation/window-bbq.png",
            "width": 1086,
            "height": 1448,
            "gallerySpan": 1,
            "galleryFit": "cover",
            "alt": "Зона барбекю Posted / навигация"
      },
      {
            "type": "image",
            "src": "./assets/spectrum-navigation/planter.png",
            "width": 1086,
            "height": 1448,
            "gallerySpan": 1,
            "galleryFit": "cover",
            "alt": "Rassvet.digital / оформление"
      },
      {
            "type": "image",
            "src": "./assets/spectrum-navigation/window-slogan.png",
            "width": 1086,
            "height": 1448,
            "gallerySpan": 1,
            "galleryFit": "cover",
            "alt": "Стань частью спектра / оформление окна"
      },
      {
            "type": "video",
            "src": "./assets/spectrum-navigation/navigation-live.mp4",
            "width": 1080,
            "height": 1920,
            "autoplay": true,
            "gallerySpan": 1,
            "galleryFit": "cover",
            "alt": "Навигация / видео реализации"
      }
],
    navigationStickers: [
      {
            "arrow": {
                  "src": "./assets/spectrum-navigation/7.png",
                  "width": 2473,
                  "height": 2473,
                  "alt": "Стрелка вверх"
            },
            "labels": [
                  {
                        "src": "./assets/spectrum-navigation/5.png",
                        "width": 11752,
                        "height": 1470,
                        "alt": "Неотложная аналитика Brand Analytics"
                  },
                  {
                        "src": "./assets/spectrum-navigation/17.png",
                        "width": 6422,
                        "height": 2342,
                        "alt": "Зал Posted"
                  },
                  {
                        "src": "./assets/spectrum-navigation/18.png",
                        "width": 5637,
                        "height": 2346,
                        "alt": "Biblioteka"
                  },
                  {
                        "src": "./assets/spectrum-navigation/23.png",
                        "width": 7314,
                        "height": 2368,
                        "alt": "Главный зал"
                  },
                  {
                        "src": "./assets/spectrum-navigation/15.png",
                        "width": 9852,
                        "height": 2024,
                        "alt": "Кофеточка Eastwood’s"
                  },
                  {
                        "src": "./assets/spectrum-navigation/10.png",
                        "width": 8449,
                        "height": 2080,
                        "alt": "Точка роста mads"
                  },
                  {
                        "src": "./assets/spectrum-navigation/12.png",
                        "width": 11589,
                        "height": 1864,
                        "alt": "Нетворк зона МАРКОМ Клуб"
                  },
                  {
                        "src": "./assets/spectrum-navigation/16.png",
                        "width": 9910,
                        "height": 2081,
                        "alt": "Зона барбекю Posted"
                  },
                  {
                        "src": "./assets/spectrum-navigation/19.png",
                        "width": 10254,
                        "height": 2246,
                        "alt": "Битва экстракейсов"
                  },
                  {
                        "src": "./assets/spectrum-navigation/6.png",
                        "width": 10462,
                        "height": 1919,
                        "alt": "Зона комфорта НОНТОН"
                  }
            ],
            "title": "Навигационные наклейки / помещение",
            "maxRatio": 7.994557823129251
      },
      {
            "title": "Навигационные наклейки / улица",
            "arrow": {
                  "src": "./assets/spectrum-navigation/purple-8.png",
                  "width": 2473,
                  "height": 2473,
                  "alt": "Фиолетовая стрелка вверх",
                  "bounds": [
                        110,
                        110,
                        2253,
                        2253
                  ]
            },
            "labels": [
                  {
                        "src": "./assets/spectrum-navigation/purple-22.png",
                        "width": 11222,
                        "height": 2080,
                        "alt": "Спектрум & Rassvet.award",
                        "bounds": [
                              79,
                              79,
                              11064,
                              1922
                        ]
                  },
                  {
                        "src": "./assets/spectrum-navigation/purple-20.png",
                        "width": 10681,
                        "height": 2243,
                        "alt": "Зона барбекю Posted",
                        "bounds": [
                              79,
                              79,
                              10522,
                              2084
                        ]
                  },
                  {
                        "src": "./assets/spectrum-navigation/purple-21.png",
                        "width": 6422,
                        "height": 2342,
                        "alt": "Зал Posted",
                        "bounds": [
                              82,
                              82,
                              6257,
                              2178
                        ]
                  }
            ],
            "maxRatio": 7.994557823129251
      }
],
    badges: [
      { label: 'Организатор', front: './assets/spectrum-experiment/badge-1.png', back: './assets/spectrum-experiment/badge-reverse-warm.png', backCrop: [285, 710, 490, 710], crop: [283, 720, 490, 715] },
      { label: 'Участник', front: './assets/spectrum-experiment/badge-2.png', back: './assets/spectrum-experiment/badge-reverse-purple.png', backCrop: [284, 762, 491, 694], crop: [280, 726, 495, 708] },
      { label: 'Партнер', front: './assets/spectrum-experiment/badge-4.png', back: './assets/spectrum-experiment/badge-reverse-silver.png', backCrop: [279, 752, 500, 718], crop: [275, 724, 508, 716] },
      { label: 'Спикер', front: './assets/spectrum-experiment/badge-3.png', back: './assets/spectrum-experiment/badge-reverse-blue.png', backCrop: [287, 772, 487, 681], crop: [278, 733, 498, 699] },
    ],
    badgeMedia: [
      { type: 'video', src: './assets/spectrum-experiment/badges-video.mp4', width: 720, height: 1280, autoplay: true, gallerySpan: 1, galleryFit: 'cover', alt: 'Бейджи / видео реализации' },
      { type: 'image', src: './assets/spectrum-experiment/badges-photo.png', width: 1086, height: 1448, gallerySpan: 1, galleryFit: 'cover', alt: 'Бейджи / фотография реализации' },
    ],
    registration: {
      internalFilter: 'outdoor', category: 'Наружные коммуникации',
      video: './assets/spectrum-experiment/registration-web.mp4',
      media: [
        { type: 'image', src: './assets/spectrum-experiment/registration-layout.png', width: 3001, height: 860, fit: 'contain', alt: 'Регистрация / макет' },
        { type: 'image', src: './assets/spectrum-experiment/registration-photo.png', width: 3407, height: 1411, fit: 'contain', alt: 'Регистрация / реализация' },
      ],
    },
    comparison: {
      before: './assets/spectrum-experiment/entrance-before.png',
      after: './assets/spectrum-experiment/entrance-after.png',
      // Same distant poster on both sides; coordinates refer to the original frame.
      sharedRegions: [[[39, 753], [109, 750], [114, 886], [39, 888]]],
      width: 1086, height: 1448, label: 'Входная группа / до и после',
      internalFilter: 'outdoor', category: 'Наружные коммуникации',
    },
    ready: true,
    intro: 'Фестиваль для специалистов коммуникационной индустрии, PR, маркетинга.',
    role: 'Дизайнер наружных коммуникаций',
    stats: '61 макет, 47 фотопривязок',
    scope: 'Фотозона, баннеры и наклейки навигации, заставки на экран, стикерпак, плакаты, бейджи.',
    layout: 'grid', decorativeObject: null,
    internalFilters: spectrumInternalFilters.filter(({ id }) => !['badges', 'navigation'].includes(id)).map(({ id, label }) => ({ id, label: id === 'stickers' ? 'Наклейки' : label, media: [] })),
    media: [],
  },
  {
    id: 'advertalyze', number: 2, title: 'Advertalyze', shortType: 'Эсэмэм',
    films: advertalyzeFilms,
    rbi: advertalyzeRbi,
    marquee: advertalyzeMarquee,
    photodump: advertalyzePhotodump,
    vacuum: advertalyzeVacuum,
    videoPair: advertalyzeVideoPair,
    news: advertalyzeNews,
    archive: advertalyzeArchive,
    finale: advertalyzeFinale,
    ready: true,
    intro: 'Digital-агентство. Топ-1 SMM-агентство Ruward Award, 2026.',
    role: 'Дизайнер социальных сетей', stats: 'Пока не посчитала',
    scope: 'Креативная верстка постов, создание ИИ-видео и изображений, монтаж видео.',
    layout: 'collage',
    decorativeObject: null,
    media: [...advertalyzeFilms, ...advertalyzeRbi, ...advertalyzeMarquee, ...advertalyzePhotodump, ...advertalyzeVacuum, ...advertalyzeVideoPair, ...advertalyzeNews, ...advertalyzeFinale],
  },
  {
    id: 'citydrive', number: 3, title: 'Ситидрайв', shortType: 'Креативы',
    ready: true,
    intro: 'Сервис каршеринга по всей России.',
    role: 'Дизайнер креативов и спецпроектов', stats: 'Пока не посчитала',
    scope: 'Оклейка объектов, печатные материалы, верстка материалов для рассылок, диджитал-дизайн.',
    layout: 'editorial', decorativeObject: null,
    citydrive: citydriveContent,
    internalFilters: [
      { id: 'kroshevo', label: 'Крошево', media: [...citydriveContent.postcard, citydriveContent.postcardVideo, ...citydriveContent.guide, citydriveContent.cones, citydriveContent.coneFinal, ...citydriveContent.photos] },
      { id: 'outline', label: 'Ситидрайв × OUTLINE', description: '{Колаборация}. Фестиваль Outline не состоялся. Ситидрайв сделали пиар-активацию — загрузили диджей-сеты на флешки и положили в каршеринг.', media: [citydriveContent.hero, citydriveContent.phone, ...citydriveContent.covers, citydriveContent.pack, citydriveContent.card, ...citydriveContent.badge] },
      { id: 'other', label: 'Другое', media: citydriveContent.other },
    ],
    media: [],
  },
  {
    id: 'bitrix24', number: 4, title: 'Битрикс24', shortType: 'Презентации',
    ready: true,
    intro: 'Презентации для Битрикс24.', role: 'Дизайн презентаций', stats: 'Пока не посчитала',
    scope: 'Материалы для выступлений и отчетных презентаций.',
    layout: 'stacked', media: [], decorativeObject: null,
    internalFilters: [
      { id: 'b2b-cmo', label: 'B2B CMO', layout: 'grid', media: presentationSlides('b2b-cmo', 'B2B CMO', 21) },
      { id: 'stachka', label: 'Стачка', layout: 'grid', media: presentationSlides('stachka', 'Стачка', 17) },
      { id: 'techwriter-days', label: 'Techwriter days', layout: 'grid', media: presentationSlides('techwriter-days', 'Techwriter days', 17) },
      { id: 'pr-report', label: 'Отчетная PR', layout: 'grid', media: presentationSlides('pr-report', 'Отчетная PR', 23, {
        width: 2000, height: 1125,
        videos: { 2: { width: 1916, height: 1080 }, 3: { width: 1280, height: 720 }, 7: { width: 1916, height: 1080 }, 9: { width: 1916, height: 1080 } },
      }) },
      { id: 'big-bounty', label: 'Big Bounty', layout: 'grid', media: presentationSlides('big-bounty', 'Big Bounty', 10) },
    ],
  },
  {
    id: 'f-date-eat', number: 5, title: 'F Date&Eat', shortType: 'Визуальный язык',
    ready: true,
    intro: 'Приложение для знакомств', role: 'Дизайнер презентаций', stats: 'Пока не посчитала',
    scope: 'Презентации B2B, проработка визуального языка, генерация реалистичных ИИ-изображений, рекламные посты в ТГ, наклейки на вход в рестораны',
    fDate: fDateContent,
    media: [], decorativeObject: null, layout: 'stacked',
    internalFilters: [
      { id: 'partners', label: 'Презентация для партнеров', layout: 'stacked', media: fDateContent.partners },
      { id: 'ambassadors', label: 'Презентация для амбассадоров', layout: 'stacked', media: fDateContent.ambassadors },
      { id: 'other', label: 'Другое', layout: 'stacked', media: [fDateContent.cover, ...fDateContent.cards.flat()] },
    ],
  },
  { id: 'fresh-auto', number: 6, title: 'Fresh Auto', shortType: 'Коммуникации',
    ready: true,
    intro: 'Автомобильный маркетплейс. Топ-3', role: 'Графический и коммуникационный дизайнер', stats: 'Пока не посчитала',
    scope: 'Бренд-система, дизайн мерча, оклейка авто, коммуникационный дизайн',
    fresh: true, internalFilters: freshSections, media: freshSections.flatMap(section => section.media),
    decorativeObject: null, layout: 'stacked',
  },
  { id: 'new-media-lab', number: 7, title: 'New Media Lab', shortType: 'Брендинг', ready: true, nml: true, intro: 'Лаборатория новых медиа', role: 'Дизайнер айдентики', stats: '', scope: 'Символ, логотип, типографика, графическая система и носители', internalFilters: nmlSections, media: nmlSections.flatMap(section => section.media), decorativeObject: null, layout: 'stacked' },
];

for (const project of projects) {
  Object.assign(project, {stats:'',scope:''}, projectCopy[project.id]);
  if(project.id === 'bitrix24') for(const section of project.internalFilters) Object.assign(section, bitrixSectionCopy[section.id]);
  project.poster = projectPosters[project.id];
  if (project.citydrive) project.media = project.internalFilters.flatMap(filter => filter.media);
  if (project.registration) {
    project.media = [...project.registration.media, ...(project.badgeMedia || []), ...(project.navigationMedia || []), ...(project.stagePresentation?.media || []), ...(project.photowall?.media || []), ...(project.stickerPack?.media || []), ...(project.posterWall?.media || []), ...(project.posterDocumentation || [])];
    project.internalFilters.find(filter => filter.id === project.registration.internalFilter).media = project.media;
  }
  if (project.posterWall) project.internalFilters.find(filter => filter.id === 'posters').media = [...project.posterWall.media, ...(project.posterDocumentation || [])];
  if (project.stickerPack) project.internalFilters.find(filter => filter.id === 'stickers').media = project.stickerPack.media;
  if (project.photowall) project.internalFilters.find(filter => filter.id === 'photowall').media = project.photowall.media;
}

// Keep original files for the viewer; lighter copies are used in the scrolling page.
for (const item of projects[0].media) {
  if (assetPreviews[item.src]) { item.highResSrc = item.src; item.src = assetPreviews[item.src]; }
}

// Work records point to the canonical media above; categories are derived, not duplicated.
export const workItems = createWorkItems(projects);
for (const project of projects) project.workTypes = [...new Set(workItems.filter(item => item.projectId === project.id).flatMap(item => item.types))];
