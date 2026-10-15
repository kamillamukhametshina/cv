import { digitalMedia, perekrestokModel } from './digital-media.js?v=5';
import { recycleMedia } from './recycle-media.js';
const perekrestokCaptions = [
  'Готовая 3д модель / хомяк', 'Готовая 3д модель / сосислон', 'Готовая 3д модель / яблоко',
  'Референс / яблоко', 'Референс / хомяк', 'Референс / сосислон', 'Пост в тг-канале перекрестка',
];
perekrestokCaptions.forEach((caption, index) => { digitalMedia.perekrestok[index].caption = caption; });
digitalMedia['phoenix-online'].forEach(item => { item.caption = item.alt; });
const block = (kind, media) => ({ kind, media });
function work(id, title, description, order, coverIndex, blocks) {
  const source = digitalMedia[id];
  const layout = blocks(source);
  return { id, title, description, order, projectId: null, types: ['Диджитал контент'], year: null,
    ready: true, layout: 'custom', cover: source[coverIndex], coverPosition: id === 'sence' ? 'center top' : 'center', blocks: layout,
    media: [...new Set(layout.flatMap(row => row.media))] };
}
export const digitalWorks = [
  work('perekrestok', 'Перекресток', 'Персонажи, digital-макеты и видеоконтент.', 0, 3, m => [
    block('three', [m[3],m[5],m[4]]), block('three', [m[2],m[1],m[0]]), { ...block('model', perekrestokModel), label: 'Финальная версия / яблоко' }, block('phone', [m[6]]),
  ]),
  work('sence', 'Sence', 'Музыкальные релизы, визуальный контент и оформление социальных сетей.', 3, 3, m => [
    block('two', [m[2],m[1]]), block('three', [m[4],m[6],m[5]]),
    block('phones-poster', [m[7],m[3],m[8]]), block('one', [m[0]]),
  ]),
  work('phoenix-online', 'Феникс Онлайн', 'Инфографика, телеканалы и тематические публикации.', 4, 4, m => [
    block('one', [m[5]]), block('three', [m[13],m[1],m[12]]),
    block('wide-four', [m[9],m[7],m[8],m[6]]), block('two', [m[10],m[3]]),
    block('wide-four', [m[0],m[2],m[4],m[11]]),
  ]),
  work('tender-pioneer', 'Тендер Пионер', 'Визуальная концепция рекламных материалов и серия наружных носителей.', 1, 2, m => [
    block('three', [m[9],m[12],m[11],m[13],m[10],m[8]]), block('one', [m[2]]), block('one', [m[0]]),
    block('marquee', [m[3],m[7],m[6],m[1],m[4],m[5]]),
  ]),
  work('region-steel', 'Регион Сталь', 'Коммуникации работодателя, оформление чат-бота и видеорубрик.', 2, 2, m => [
    block('one', [m[0]]), block('two', [m[3],m[4],m[1],m[5]]), block('one', [m[10]]), block('one', [m[2]]),
    block('wide-four', [m[6],m[7],m[8],m[9]]),
  ]),
];

const workKinds = {perekrestok:'Креатив',sence:'Эсэмэм','phoenix-online':'Эсэмэм','tender-pioneer':'Креатив','region-steel':'Монтаж, эйчар брендинг'};
for (const work of digitalWorks) work.workKind=workKinds[work.id];
const covers={sence:{type:'image',src:'./assets/digital/sence-cover.webp',width:957,height:957,alt:'Sence — обложка'},perekrestok:{type:'image',src:'./assets/digital/perekrestok-cover.webp',width:1400,height:893,alt:'Перекресток — обложка'}};
for(const [id,cover] of Object.entries(covers)){digitalMedia[id].push(cover);const work=digitalWorks.find(w=>w.id===id);work.cover=cover;work.coverPosition='center';}
digitalWorks.find(work=>work.id==='region-steel').animatedCover=true;

const recycleBlocks = [
  { kind:'recycle-identity', media:[recycleMedia.logo], colors:['#F7EED1','#002C17','#412A14'] },
  block('recycle-paper', ['paper-1','paper-2','paper-3','paper-4'].map(id=>recycleMedia[id])),
  block('recycle-symbols', ['cycle-1','cycle-3','cycle-4','cycle-2','cycle-5'].map(id=>recycleMedia[id])),
  block('one', [recycleMedia.collage]), block('one', [recycleMedia.layers]),
  block('three', [recycleMedia.why,recycleMedia.exceptions,recycleMedia.process]),
  block('recycle-ending', [recycleMedia.poster,recycleMedia.recycling]),
];
digitalWorks.push({
  id:'recycle-it', title:'Recycle It!', projectId:null, types:['Диджитал контент'],
  year:null, order:5, ready:true, layout:'custom', cover:null, workKind:'Эсэмэм',
  intro:'Учебный проект по переработке макулатуры в Финансовом университете при Правительстве РФ',
  role:'дизайнер соцсетей', description:'Визуальный язык и публикации о переработке макулатуры', hideTask:true,
  blocks:recycleBlocks, media:recycleBlocks.flatMap(row=>row.media),
});
