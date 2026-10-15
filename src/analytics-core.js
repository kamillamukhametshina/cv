export const CONSENT_KEY = 'portfolio.analytics-consent.v1';
export const CONSENT_TTL = 180 * 24 * 60 * 60 * 1000;
export const GOALS = new Set(['resume_download', 'telegram_click']);

export function readConsent(storage, now = Date.now()) {
  try {
    const value = JSON.parse(storage.getItem(CONSENT_KEY));
    return value && ['accepted', 'declined'].includes(value.choice) && Number.isFinite(value.at)
      && value.at <= now && now - value.at < CONSENT_TTL ? value.choice : null;
  } catch { return null; }
}

export function productionCounter(config, href) {
  try {
    const here = new URL(href), site = new URL(config.siteURL);
    return Number.isSafeInteger(config.counterId) && config.counterId > 0
      && here.protocol === 'https:' && here.origin === site.origin
      && [site.pathname, site.pathname + 'index.html'].includes(here.pathname);
  } catch { return false; }
}

// No calls, script loads, or pre-consent event queues until explicit acceptance.
export function createAnalyticsController({ counterId, enabled, storage, load, now = Date.now, reset = () => {} }) {
  let choice = readConsent(storage, now()), send = null, loading = false, started = false;
  let revision = 0, current = null, previousURL = '', lastURL = '';
  function dispatch(...args) { try { send?.(...args); } catch { /* Analytics must not interrupt navigation. */ } }
  function hit() {
    if (!send || choice !== 'accepted' || !current || current.url === lastURL) return;
    dispatch(counterId, 'hit', current.url, { title: current.title, referer: previousURL });
    previousURL = lastURL = current.url;
  }
  async function start() {
    if (!enabled || choice !== 'accepted' || loading || send || !current) return;
    loading = started = true;
    const ticket = ++revision;
    try {
      const command = await load();
      if (ticket !== revision || choice !== 'accepted') return;
      send = command;
      dispatch(counterId, 'init', {
        defer: true, webvisor: false, clickmap: false, trackLinks: false,
        accurateTrackBounce: false, trackHash: false, ecommerce: false,
        childIframe: false, disableYtm: true,
      });
      hit();
    } catch { /* Ad blockers and network failures never block the portfolio. */ }
    finally { if (ticket === revision) loading = false; }
  }
  return {
    get choice() { return choice; },
    get enabled() { return enabled; },
    page(url, title) { current = { url, title }; hit(); void start(); },
    choose(next) {
      if (!['accepted', 'declined'].includes(next)) return;
      choice = next;
      try { storage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: now() })); } catch { /* Session-only choice. */ }
      if (next === 'accepted') { void start(); return; }
      revision++;
      if (send) dispatch(counterId, 'destruct');
      send = null; loading = false; lastURL = previousURL = '';
      if (started) reset();
    },
    goal(name) { if (choice === 'accepted' && send && GOALS.has(name)) dispatch(counterId, 'reachGoal', name); },
  };
}
