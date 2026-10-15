const root = './assets/advertalyze-photodump';
const titles = ['Как работает фотодамп', '1 кадр — крючок', '2–3 кадры — люди', '4–5 кадры — среда', '6–9 кадры — детали', 'Вишенки на торте'];
export const advertalyzePhotodump = [
  ...titles.map((title, index) => {
    const number = String(index + 1).padStart(2, '0');
    return { type: 'image', src: `${root}/${number}.jpg`, highResSrc: `${root}/${number}-original.png`, width: 1080, height: 1350, alt: `Advertalyze — ${title}` };
  }),
  { type: 'video', src: `${root}/phone-alpha.webm`, safariSrc: `${root}/phone-alpha.mov`, poster: `${root}/phone-poster.png`, width: 540, height: 1000, autoplay: true, fit: 'contain', alt: 'Advertalyze — фотодамп на телефоне' },
];
