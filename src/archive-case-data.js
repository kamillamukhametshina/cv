import { archiveCaseMedia } from './archive-case-media.js?v=3';
const b = (kind, media, extra = {}) => ({kind, media, ...extra});
const s = archiveCaseMedia['solar-staff'];
const m = archiveCaseMedia['media-case-club'];
const d = archiveCaseMedia['29di'];
const named = (collection, name, alt) => { const item = collection[name]; if (!item) throw new Error(`Missing case asset: ${name}`); if (alt) item.alt = alt; return item; };
const solar = (name, alt) => named(s,name,alt);
const club = (name, alt) => named(m,name,alt);
const di = (name, alt) => named(d,name,alt);
function work(id,title,type,order,description,cover,blocks) {
 return {id,title,types:[type],order,description,cover,blocks,projectId:null,year:null,ready:true,layout:'custom',media:[...new Set(blocks.flatMap(block=>block.media))]};
}
const booth = solar('Изображение ChatGPT 8 окт. 2026 г., 15_12_48-1.png','Solar Staff — стенд и команда');
const machine = solar('Изображение ChatGPT 8 окт. 2026 г., 15_09_21-2.png','Игровой автомат');
const menu = solar('A4 - 4.png','Меню лимонадной станции');
const colors = [3,4,5,6].map(n=>club(`Slide 16_9 - ${n}.png`,'Media Case Club — цветовая версия логотипа'));
const returns = [8,9,10,11].map(n=>club(`Instagram post - ${n}.png`,'Media Case Club возвращается'));
const badge = Object.values(m).find(item=>item.sourceFile.includes('Photoroom'));
badge.alt = 'Бейдж Юлии Бойцовой';
export const archiveCases = [
 work('solar-staff','Solar Staff','Ивенты',31,'Оформление стенда, игровые механики и лимонадная станция.',booth,[
  b('solar-hero',[booth,machine,menu]),
  b('one',[solar('Изображение ChatGPT 8 окт. 2026 г., 15_12_50-4.png','Предсказания для бизнеса — игровой автомат на стенде')]),
  b('half',[solar('Изображение ChatGPT 8 окт. 2026 г., 15_12_52-6.png','Игровой автомат на стенде')]),
  b('half',[menu]),
  b('wide-three',[
   solar('Изображение ChatGPT 8 окт. 2026 г., 15_12_49-3.png','Карточка с предсказанием'),
   solar('Изображение ChatGPT 8 окт. 2026 г., 15_12_49-2.png','Лимонадная станция'),
   solar('Тост с напитками у стенда Solar Staff.png','Лимонады Solar Staff'),
  ]),
 ]),
 work('29di','29DI','Диджитал контент',6,'Айдентика свечей: анимация, стикеры, этикетки и предметная съёмка.',di('7.png','29DI — свеча «Виноград»'),[
  b('two',[2,3,4,5].map(n=>di(`${n}.mp4`,`29DI — анимация ${n-1}`))),
  b('one',[di('1.gif','29DI — digital-применение айдентики')]),
  b('marquee',Object.values(d).filter(item=>item.sourceFile.startsWith('стик')).map((item,i)=>{ item.alt=`29DI — стикер ${i+1}`; return item; })),
  b('cycle',[37,38,39].map(n=>di(`A4 - ${n}.png`,'29DI — этикетка свечи')),{label:'Этикетки / три аромата'}),
  b('two',[7,8,9,10].map(n=>di(`${n}.png`, n===7?'29DI — свеча «Виноград»':'29DI — предметная съёмка свечей'))),
  b('one',[di('11.mov','29DI — фильм о свечах')]),
 ]),
 work('media-case-club','Media Case Club','Ивенты',30,'Визуальная система клуба: логотип, анонсы, печатные материалы и оформление события.',colors[0],[
  b('one',[club('горизонтальный.svg','Media Case Club — горизонтальный логотип')]),
  b('half',[club('горизонтальный (1).svg','Media Case Club — вертикальный логотип')]),
  b('one',[club('Slide 16_9 - 2 (1).png','Media Case Club — фирменные цвета')]),
  b('cycle',colors,{label:'Логотип / цветовые версии',interval:1000}),
  b('mcc-pattern',[]),
  b('qr-comparison',[club('Куар код до.png','QR-плакат — исходная версия'),club('A4 - 72.png','Наш бренд — твоя работа / QR-стрелка'),club('mcc-7.gif','Печатные карточки Media Case Club')],{label:'QR-плакат'}),
  b('four',[67,59,69,68].map(n=>club(`A4 - ${n}.png`,'Наш бренд — твоя работа'))),
  b('mcc-badge',[club('МСС версия до.png','Media Case Club возвращается — исходная версия'),...returns,club('юля б (2).png','Бейдж Юлии Бойцовой — макет')]),
  b('speaker',[club('Instagram post - 79.png','Мадонна Мур — личный бренд как новое медиа'),club('Instagram post - 24.png','Игорь Малинин — спикер')]),
  b('wide-four', ['Instagram post - 92.png','Instagram post - 93.png','Instagram post - 9 — копия.png','Instagram post - 8 — копия.png'].map(name=>club(name,'Media Case Club — спикеры'))),
  b('three',['Instagram post - 87.jpg','Instagram post - 89.jpg','Instagram post - 97.jpg','Instagram post - 99.jpg','Instagram post - 101.jpg','Instagram post - 38.jpg','Instagram post - 41.jpg','карточка-приглашение.png','501814.png','501816.png','501817.png','501818.png','Instagram post - 22.png'].map(name=>club(name,'Media Case Club — публикации и отзывы'))),
  b('three',[87,105,106].map(n=>club(`A4 - ${n}.png`,'Media Case Club — дипломы и сертификаты'))),
  b('one',[club('mcc-6.jpg','Финалисты Media Case Club')]),
  b('two',[club('mcc-8.jpg','Media Case Club — выступление'),club('mcc-9.gif','Media Case Club — праздничный торт')]),
 ]),
];

archiveCases.find(work=>work.id==='29di').workKind = 'Диджитал контент';
const candleFilm=d['11.mov']; candleFilm.autoplay=true; candleFilm.controls=true;
