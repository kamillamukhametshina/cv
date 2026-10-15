import { freshAssets } from './fresh-data.js?v=4';
const item = (section, name, alt) => ({ ...freshAssets[section][name], alt: `Fresh — ${alt}`, caption: alt });
const block = (className, media) => ({ className, media });
const service = (name, alt) => item('service', name, alt);
const template = (name, alt) => item('template', name, alt);
const carAssets = {
  AP_003_Cardfxg_Sedan_B: ['sedan-white', [91, 251, 1736, 532]],
  dfg: ['sedan-black', [174, 275, 1568, 478]],
  '1fs': ['wagon-white', [20, 194, 1832, 582]],
  '2dfg': ['wagon-black', [157, 233, 1550, 485]],
};
const other = (name, alt) => {
  const media = item('other', name, alt);
  if (carAssets[name]) {
    const [file, bounds] = carAssets[name];
    Object.assign(media, { src: `./assets/fresh/cutouts/${file}.png`, width: 1905, height: 825, bounds });
  }
  return media;
};
const sides = (name, caption) => [0, 1].map(half => ({ ...service(name, `${caption} — ${half ? 'оборотная' : 'лицевая'} сторона`), caption, half }));
export const freshSections = [
  { id: 'service', label: 'Fresh.сервис', blocks: [
    block('fresh-single', [service('Group 2131332291', 'Графические элементы — запчасти и текстуры')]),
    block('fresh-wide fresh-liquids', [
      service('91630502_Ed black liquid splashing -10 1 (2)', 'Машинное масло'),
      service('91630502_Ed black liquid splashing -10 1 (1)', 'Бензин'),
      service('91630502_Ed black liquid splashing -10 1', 'Вода'),
    ]),
    block('fresh-wide fresh-service-board', [
      service('Frame 1171277965', 'Fresh.сервис — сторис'),
      service('Frame 1171277964', 'Сторис с текстурой'),
      service('Frame 1171277967', 'Замена масла за 1 рубль — сторис'),
      service('Group 2131332292', 'Графические элементы — запчасти и текстуры'),
      service('Group 2131332283', 'Билборд Fresh.сервис'),
      service('Group 2131332305', 'Наружная реклама — сервисные работы'),
      service('Group 2131332288', 'Плакаты — шины и масло'),
    ]),
    block('fresh-wide fresh-uniform', [...sides('Asset 4 1', 'Мерч — куртка'), ...sides('Asset 3 1', 'Мерч — жилет'), ...sides('image 14', 'Мерч — поло')]),
    block('fresh-pair fresh-collateral', [
      service('Group 2131332298', 'Сервисные карточки'), service('Group 2131332303', 'Сервисная книжка'),
      service('Group 2131332299', 'Бланки'), service('Group 2131332302', 'Ароматизатор'),
      service('Group 2131332300', 'Карточки с номером телефона'), service('Group 2131332292-1', 'Пресс-волл'),
    ]),
  ]},
  { id: 'template', label: 'Шаблон презентации', blocks: [
    block('fresh-stack', [template('Размеры', 'Типографика шаблона'), template('Сетка', 'Сетка шаблона'), template('Автолейаут', 'Автолейаут')]),
    block('fresh-marquee', ['4799040', '4799041', '4799042', '4799043'].map((name, index) => template(name, `Обложка презентации — вариант ${index + 1}`))),
    block('fresh-pair', [template('4799091', 'Содержание — теги'), template('4799078', 'Содержание — список')]),
    block('fresh-marquee', ['4799074', '4799075', '4799076', '4799077'].map((name, index) => template(name, `Разделитель — вариант ${index + 1}`))),
    block('fresh-pair', [
      template('4799098', 'Изображение и пояснение'), template('4799099', 'Таблица и график'),
      template('4799092', 'Нумерованные блоки'), template('4799095', 'Текстовые блоки'),
      template('4799093', 'Нумерованный список'), template('4799096', 'Столбчатые диаграммы'),
      template('4799094', 'Три колонки текста'), template('4799097', 'Круговая диаграмма'),
    ]),
    block('fresh-marquee', ["4799092 — копия", "4799093 — копия", "4799094 — копия", "4799095 — копия"].map((name, index) => template(name, `Финальный слайд — вариант ${index + 1}`))),
    block('fresh-charts', [
      template('Horizontal Bar Chart', 'Горизонтальная диаграмма'), template('Doughnut Chart', 'Кольцевая диаграмма'), template('Line', 'Комбинированная диаграмма'),
      template('Floating Bar Chart', 'Плавающие столбцы'), template('Line Chart', 'Линейный график'), template('Polar Area', 'Полярная диаграмма'),
    ]),
  ]},
  { id: 'other', label: 'Другое', blocks: [
    block('fresh-single', [other('Group 2404', 'Фирменные материалы и наружная реклама')]),
    block('fresh-wide fresh-car-hero', [other('transportation_vehчicle_premium_template_6 1-Photoroom', 'Оклейка внедорожника')]),
    block('fresh-wide fresh-car-variants', [other('AP_003_Cardfxg_Sedan_B', 'Оклейка белого седана'), other('dfg', 'Оклейка чёрного седана'), other('1fs', 'Оклейка белого универсала'), other('2dfg', 'Оклейка чёрного универсала')]),
    block('fresh-pair fresh-boxes', [other('photo_2026-10-05 14.56.08 1', 'Велкомпак'), other('photo_2026-10-05 14.55.56 1', 'Приветственная карточка')]),
    block('fresh-single', [other('Frame 2131332984', 'Скачивайте приложение — новогодний баннер')]),
    block('fresh-pair fresh-posters', [other('Frame 1171277969', '20 000+ проверенных автомобилей'), other('Frame 2484', 'Розыгрыш')]),
  ]},
];
for (const section of freshSections) {
  section.layout = 'stacked';
  section.media = section.blocks.flatMap(block => block.media);
}
