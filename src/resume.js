import { createFlyHome } from './fly-home.js?v=10';
import { typography } from './typography.js?v=5';

export function createResume(downloadURL) {
  const element = document.createElement('article');
  element.className = 'resume-page';
  element.innerHTML = `
    <figure class="resume-portrait">
      <img class="resume-photo" src="./assets/about/portrait.webp" width="1000" height="1000" alt="Камилла Мухаметшина" fetchpriority="high">
      <div class="resume-fly" aria-hidden="true">
        <img src="./assets/fly/fly-final.png" alt="">
        <video data-self-managed muted loop playsinline preload="metadata" src="./assets/fly/fly-final.webm"></video>
      </div>
    </figure>
    <div class="resume-details">
    <div class="resume-copy">
      <p data-proximity>Я занимаюсь дизайном, но мой путь проходил через HR, ивенты, коммуникации и проектную работу. Мне интересно соединять разные области и придумывать решения там, где нет готового шаблона.</p>
      <p data-proximity>Хорошо работаю с проектами где: быстрые и горящие сроки; нужно собирать данные в удобную систему; нужно искать характер и показывать смысловую ценность через визуальную коммуникацию</p>
    </div>
    <a class="resume-download" data-proximity>Скачать резюме</a>
    </div>`;
  for (const paragraph of element.querySelectorAll('.resume-copy p')) paragraph.textContent = typography(paragraph.textContent);
  const download = element.querySelector('.resume-download');
  download.href = downloadURL;
  download.download = 'Мухаметшина Камилла — резюме.pdf';
  if (!matchMedia('(max-width:1023px)').matches) {
    element.querySelector('.resume-fly').remove();
    const game = createFlyHome({ minScale: .3, scaleRange: .3, challenge: 'Поймай муху, если сможешь' });
    game.element.classList.add('resume-game');
    game.element.querySelector('.fly-home-challenge').dataset.proximity = '';
    const sizeObserver = new ResizeObserver(([entry]) => {
      element.style.setProperty('--resume-block-height', `${entry.borderBoxSize[0].blockSize}px`);
    });
    sizeObserver.observe(element.querySelector('.resume-details')); 
    element.append(game.element);
    return { element, dispose() { sizeObserver.disconnect(); game.dispose(); } };
  }
  const frame = element.querySelector('.resume-portrait');
  const video = element.querySelector('video');
  video.muted = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  let visible = false, disposed = false;
  function sync() {
    const active = visible && !reduced.matches && !document.hidden && !disposed;
    frame.classList.toggle('is-fly-moving', active);
    if (active) video.play().catch(() => {});
    else video.pause();
  }
  video.addEventListener('playing', () => video.classList.add('is-playing'), { signal: abort.signal });
  video.addEventListener('error', () => video.classList.remove('is-playing'), { signal: abort.signal });
  document.addEventListener('visibilitychange', sync, { signal: abort.signal });
  reduced.addEventListener('change', sync, { signal: abort.signal });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(frame);
  return { element, dispose() { disposed = true; observer.disconnect(); abort.abort(); video.pause(); } };
}
