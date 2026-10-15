const captions = [
  'Не пишите, пожалуйста, я в отпуске', 'Я не игнорю, я в отпуске',
  'Отпуск — у дорожного знака', '404 — сотрудник не найден', 'Отпуск — у копира',
  'Чуть-чуть попозже, наверное, отвечу — под водой',
  'Чуть-чуть попозже, наверное, отвечу — у бассейна', 'Я не доотдыхал', 'В отпуске и т. д.',
];
export const advertalyzeMarquee = captions.map((caption, index) => {
  const number = String(index + 1).padStart(2, '0');
  return { type: 'image', src: `./assets/advertalyze-marquee/${number}.jpg`, highResSrc: `./assets/advertalyze-marquee/${number}-original.png`, width: 1280, height: 1280, alt: `Advertalyze — ${caption}` };
});
