import { freeWorkMedia } from './free-work-media.js';
const entries = [
 ['burn-yourself','Burn yourself','Плакат',[1,2]],
 ['people','People','Коллаж',[3,4]],
 ['dreams','Пацаны мечтают','Анимация',[5]],
 ['kis-kis','Кис-кис','Плакат',[6]],
 ['type-poster','Типографический плакат','Типографика',[7]],
 ['tatar-poster','Плакат / татарская типографика','Типографика',[8]],
 ['type-motion','Типографика в движении','Анимация',[9]],
 ['interface-collage','Коллаж / интерфейсы','Анимация',[10]],
 ['graphic-experiment','Графический эксперимент','Плакат',[11]],
 ['phrase-collage','Коллаж / фразы','Коллаж',[13]],
 ['sticker-sheet','Стикерпак','Иллюстрация',[15]],
 ['smirenie','Смирение','Плакат',[16]],
 ['kinetic-type','Кинетическая типографика','Анимация',[17]],
 ['circle','It’s a circle','Анимация',[18]],
 ['mama','Be good for mama','Типографика',[19]],
 ['teeth','Teeth / gearwheel','Плакат',[20]],
 ['matches','Спички','Иллюстрация',[21]],
 ['video-01','Видеозарисовка / 01','Видео',[22]],
 ['video-02','Видеозарисовка / 02','Видео',[23]],
 ['video-03','Видеозарисовка / 03','Видео',[24]],
];
const media=entries.flatMap(([,title,,numbers])=>numbers.map((n,i)=>Object.assign(freeWorkMedia[n],{
 controls:n>=22,alt:numbers.length>1?`${title} / ${i===0?'макет':'реализация'}`:title,
 caption:numbers.length>1?`${title} / ${i===0?'макет':'реализация'}`:title,
})));
const rows=[[1,2],[3,4],[5,6],[7,8],[9,10],[11,13],[15,16],[17,18],[19,20],[21],[22,24],[23]];
export const freeWorks=[{
 id:'free-collection',title:'Произвольное',workKind:'Графика, анимация и видео',projectId:null,
 types:['Произвольное'],year:null,ready:true,order:100,media:rows.flatMap(numbers=>numbers.map(n=>freeWorkMedia[n])),cover:media[0],coverFit:'contain',
 layout:'custom',description:'Плакаты, коллажи, типографика, анимация и видео',hideTask:true,
 blocks:rows.map(numbers=>({kind:numbers[0]===22?'portrait-videos':numbers[0]===21?'two':numbers.length===1?'one':'two',media:numbers.map(n=>freeWorkMedia[n])})),
}];
