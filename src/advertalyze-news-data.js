const root = './assets/advertalyze-news';
const titles = ['Инфоповоды для контента на март', 'Спорт', 'Кино и сериалы', 'Оскар и Ханна Монтана', 'События', 'Инфоповод пойман'];
export const advertalyzeNews = [
  ...titles.map((title, index) => ({ type: 'image', src: `${root}/${String(index + 1).padStart(2, '0')}.jpg`, width: 1080, height: 1080, alt: `Advertalyze — ${title}` })),
  { type: 'video', src: `${root}/clown-alpha.webm`, safariSrc: `${root}/clown-alpha.mov`, poster: `${root}/clown-poster.png`, width: 720, height: 720, autoplay: true, fit: 'contain', alt: 'Advertalyze — клоун с инфоповодами' },
];
