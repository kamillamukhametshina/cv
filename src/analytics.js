import { analyticsConfig } from './analytics-config.js';
import { createAnalyticsController, productionCounter, readConsent, CONSENT_KEY } from './analytics-core.js';
import { normalizeState, stateURL } from './state.js?v=80';

function loadMetrica() {
  return new Promise((resolve, reject) => {
    window.ym ||= function () { (window.ym.a ||= []).push(arguments); };
    window.ym.l = Date.now();
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    script.onload = () => resolve((...args) => window.ym(...args));
    script.onerror = () => { script.remove(); reject(new Error('Analytics unavailable')); };
    document.head.append(script);
  });
}

export function setupAnalytics(beforeOpen = () => {}) {
  // Keep analytics controls out of the interface until a counter is configured.
  if (!Number.isSafeInteger(analyticsConfig.counterId) || analyticsConfig.counterId <= 0) {
    return { page() {} };
  }
  let storage;
  try { storage = window.localStorage; } catch { storage = { getItem() {}, setItem() {} }; }
  const controller = createAnalyticsController({
    ...analyticsConfig, enabled: productionCounter(analyticsConfig, location.href), storage,
    load: loadMetrica, reset: () => location.reload(),
  });
  window.addEventListener('storage', event => {
    if ((event.key === CONSENT_KEY || event.key === null) && controller.choice === 'accepted'
      && readConsent(storage) !== 'accepted') controller.choose('declined');
  });
  const button = (label, action) => {
    const element = document.createElement('button'); element.type = 'button'; element.textContent = label;
    element.addEventListener('click', action); return element;
  };
  const paragraph = text => { const p = document.createElement('p'); p.textContent = text; return p; };
  const dialog = document.createElement('dialog'); dialog.className = 'privacy-dialog';
  dialog.setAttribute('aria-labelledby', 'privacy-title');
  const heading = document.createElement('h2'); heading.id = 'privacy-title'; heading.textContent = 'Конфиденциальность';
  const status = paragraph(''); status.setAttribute('role', 'status');
  dialog.append(heading,
    paragraph('Это портфолио Камиллы Мухаметшиной — здесь нет регистрации, форм и оплаты'),
    paragraph('Сайт размещён на GitHub Pages: GitHub сохраняет IP-адреса посетителей для обеспечения безопасности сервиса'),
  );
  const configured = Number.isSafeInteger(analyticsConfig.counterId) && analyticsConfig.counterId > 0;
  if (configured) dialog.append(
    paragraph('С вашего разрешения Яндекс Метрика получает данные о просмотрах страниц, браузере и устройстве, IP-адресе, скачивании резюме и переходе в Telegram, использует cookies и localStorage для статистики'),
    paragraph('Вебвизор, карты кликов и автоматическое отслеживание ссылок отключены — отказ не ограничивает доступ к работам'),
    paragraph('Выбор сохраняется в браузере на 180 дней, его можно изменить здесь — при отключении аналитики страница перезагрузится, уже переданные данные автоматически не удаляются'),
  );
  else dialog.append(paragraph('Аналитика пока не подключена — сайт не устанавливает аналитические cookies'));
  const links = document.createElement('p');
  for (const [label, href] of [
    ['Конфиденциальность GitHub', 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement'],
    ['Конфиденциальность Яндекса', 'https://yandex.ru/legal/confidential/'],
    ['Связаться со мной', 'https://t.me/kamillamukhametshina'],
  ]) { const a = document.createElement('a'); a.textContent = label; a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; links.append(a, document.createElement('br')); }
  const actions = document.createElement('div'); actions.className = 'privacy-actions';
  const banner = document.createElement('section'); banner.className = 'analytics-banner'; banner.setAttribute('aria-label', 'Настройки аналитики');
  function choose(value) { banner.hidden = true; dialog.close(); controller.choose(value); }
  function showPrivacy() {
    status.textContent = controller.enabled ? `Аналитика: ${controller.choice === 'accepted' ? 'разрешена' : 'отключена'}` : '';
    beforeOpen();
    dialog.showModal();
  }
  if (controller.enabled) actions.append(button('Отказаться', () => choose('declined')), button('Разрешить аналитику', () => choose('accepted')));
  actions.append(button('Закрыть', () => dialog.close()));
  dialog.append(links, status, actions);
  banner.append(paragraph('Разрешить Яндекс Метрике собирать статистику посещений? Используются cookies — сайт работает и без них'));
  const bannerActions = document.createElement('div'); bannerActions.className = 'privacy-actions';
  bannerActions.append(button('Отказаться', () => choose('declined')), button('Разрешить', () => choose('accepted')), button('Подробнее', showPrivacy));
  banner.append(bannerActions);
  banner.hidden = !controller.enabled || controller.choice !== null;
  const privacy = button('Конфиденциальность', showPrivacy); privacy.className = 'privacy-open';
  document.body.append(privacy, banner, dialog);
  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a');
    if (anchor?.matches('.resume-download')) controller.goal('resume_download');
    else if (anchor?.closest('#telegram-link')) controller.goal('telegram_click');
  }, true);
  return {
    page(state, title) {
      // Only normalized portfolio routes; never forward arbitrary query parameters.
      controller.page(stateURL(normalizeState(state), analyticsConfig.siteURL).href, title);
    },
  };
}
