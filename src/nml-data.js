const base = './assets/nml/';
export const nmlArtwork = {
  'logo-horizontal': { type: 'image', src: `${base}logo-horizontal.svg`, width: 3238.980, height: 568.980, alt: 'Логотип / Горизонтальная версия', fit: 'contain' },
  'logo-stacked': { type: 'image', src: `${base}logo-stacked.svg`, width: 1523.960, height: 1436.980, alt: 'Логотип / Вертикальная версия', fit: 'contain' },
  'rings-blue': { type: 'image', src: `${base}rings-blue.svg`, width: 1443.000, height: 1443.000, alt: 'Графический язык / Синий ритм', fit: 'contain' },
  'rings-red': { type: 'image', src: `${base}rings-red.svg`, width: 1443.000, height: 1443.000, alt: 'Графический язык / Красный ритм', fit: 'contain' },
  'book-color': { type: 'image', src: `${base}book-color.svg`, width: 1418.790, height: 1418.790, alt: 'Обложка / Та самая книга для маркетолога', fit: 'contain' },
  'book-outline': { type: 'image', src: `${base}book-outline.svg`, width: 1418.790, height: 1418.790, alt: 'Обложка / Контурная версия', fit: 'contain' },
  'website': { type: 'image', src: `${base}website-updated.png`, width: 3284, height: 1917, alt: 'Сайт / Индивидуальная настройка новых медиа', fit: 'contain' },
  'poster-a': { type: 'image', src: `${base}poster-a.svg`, width: 1075.150, height: 1521.480, alt: 'Плакат / Вариант 01', fit: 'contain' },
  'poster-b': { type: 'image', src: `${base}poster-b.svg`, width: 1071.950, height: 1516.950, alt: 'Плакат / Вариант 02', fit: 'contain' },
  'poster-c': { type: 'image', src: `${base}poster-c.svg`, width: 1071.950, height: 1516.950, alt: 'Плакат / Вариант 03', fit: 'contain' },
  'poster-d': { type: 'image', src: `${base}poster-d.svg`, width: 1072.100, height: 1516.950, alt: 'Плакат / Вариант 04', fit: 'contain' },
  'poster-e': { type: 'image', src: `${base}poster-e.svg`, width: 1071.950, height: 1516.950, alt: 'Плакат / Вариант 05', fit: 'contain' },
  'poster-f': { type: 'image', src: `${base}poster-f.svg`, width: 1071.950, height: 1516.950, alt: 'Плакат / Вариант 06', fit: 'contain' },
  'social-1': { type: 'image', src: `${base}social-1.svg`, width: 1040.610, height: 1040.610, alt: 'Социальные сети / Главред / Оценка текста 6,5 и 8,9', fit: 'contain' },
  'social-2': { type: 'image', src: `${base}social-2.svg`, width: 1040.610, height: 1040.610, alt: 'Социальные сети / Главред', fit: 'contain' },
  'social-3': { type: 'image', src: `${base}social-3.svg`, width: 1040.610, height: 1040.610, alt: 'Социальные сети / Яндекс Спеллер', fit: 'contain' },
  'social-4': { type: 'image', src: `${base}social-4.svg`, width: 1040.610, height: 1040.610, alt: 'Социальные сети / Яндекс Спеллер / Проверка текста', fit: 'contain' },
  'social-5': { type: 'image', src: `${base}social-5.svg`, width: 1040.610, height: 1040.610, alt: 'Социальные сети / Англоязычный сервис / Проверка текста', fit: 'contain' },
  'social-6': { type: 'image', src: `${base}social-6.svg`, width: 1040.610, height: 1040.610, alt: 'Социальные сети / RussianCorrector.com', fit: 'contain' },
};
export const nmlPosters = ["poster-a", "poster-b", "poster-c", "poster-d", "poster-e", "poster-f"].map(key => nmlArtwork[key]);
export const nmlSocial = [2, 1, 6, 5, 3, 4].map(number => nmlArtwork[`social-${number}`]);
export const nmlMedia = [
  ...Object.entries(nmlArtwork).filter(([key]) => !key.startsWith('social-')).map(([, artwork]) => artwork),
  ...nmlSocial,
];
export const nmlColors = [
  {name:'Зелёный',hex:'#AEFF25',rgb:'174, 255, 37'},
  {name:'Чёрный',hex:'#000000',rgb:'0, 0, 0'},
  {name:'Синий',hex:'#0072E5',rgb:'0, 114, 229'},
  {name:'Белый',hex:'#FFFFFF',rgb:'255, 255, 255'},
  {name:'Красный',hex:'#F44545',rgb:'244, 69, 69'},
];

export const nmlPresentation = Array.from({ length: 20 }, (_, index) => ({
  type: 'image', src: `${base}presentation/${String(index + 1).padStart(2, '0')}.png`,
  width: 1920, height: 1080, fit: 'contain',
  alt: `New Media Lab / Презентация — слайд ${index + 1}`,
}));
export const nmlSections = [
  { id: 'branding', label: 'Брендинг', media: nmlMedia },
  { id: 'presentation', label: 'Презентация', media: nmlPresentation },
];
