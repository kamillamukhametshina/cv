import { setupTextScramble } from './text-scramble.js?v=5';
// Reuse the desktop links, so both layouts always share navigation and state.
export function setupMobileNavigation({ home, indexPanel, headerNav, mobileLayout }) {
  const header = document.querySelector('.header');
  const archive = document.querySelector('.archive');
  const anchors = [home, indexPanel, headerNav].map(node => {
    const anchor = document.createComment('navigation position');
    node.before(anchor);
    return { node, anchor };
  });
  const shell = document.createElement('div');
  shell.className = 'mobile-navigation';
  shell.innerHTML = `<div class="mobile-menu-panel" id="mobile-menu-panel" inert aria-hidden="true"></div><div class="mobile-bottom-bar"><button class="mobile-menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu-panel"><span></span><span></span></button></div>`;
  document.body.append(shell);
  const panel = shell.querySelector('.mobile-menu-panel');
  const bar = shell.querySelector('.mobile-bottom-bar');
  const toggle = shell.querySelector('.mobile-menu-toggle');
  const tapScramble = setupTextScramble();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let replay = null, tapTimer = 0;
  panel.addEventListener('click', event => {
    const control = event.target.closest('button,a');
    if (!control || !open || !mobileLayout.matches || reduced.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (control === replay) return;
    tapScramble.start(control, { duration: 180 });
    // Keep external links in the original user gesture so new tabs remain allowed.
    if (control.matches('a[target="_blank"]')) return;
    event.preventDefault(); event.stopImmediatePropagation();
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      tapScramble.stopAll();
      if (!open || !control.isConnected) return;
      replay = control; control.click(); replay = null;
    }, 190);
  }, true);
  let open = false;
  let scrollY = 0;
  let lastFocus;

  function close(restoreFocus = true) {
    if (!open) return false;
    open = false;
    clearTimeout(tapTimer); tapScramble.stopAll();
    shell.classList.remove('is-open');
    shell.removeAttribute('role');
    shell.removeAttribute('aria-modal');
    shell.removeAttribute('aria-label');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    panel.inert = true;
    panel.setAttribute('aria-hidden', 'true');
    archive.inert = false;
    header.inert = false;
    delete document.documentElement.dataset.mobileMenu;
    window.scrollTo({ top: scrollY, behavior: 'instant' });
    if (restoreFocus) (lastFocus?.isConnected ? lastFocus : toggle).focus({ preventScroll: true });
    return true;
  }
  function show() {
    if (!mobileLayout.matches) return;
    lastFocus = document.activeElement;
    scrollY = window.scrollY;
    document.body.style.setProperty('--mobile-menu-scroll', `${-scrollY}px`);
    document.documentElement.dataset.mobileMenu = 'open';
    open = true;
    shell.classList.add('is-open');
    shell.setAttribute('role', 'dialog');
    shell.setAttribute('aria-modal', 'true');
    shell.setAttribute('aria-label', 'Навигация по архиву');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть меню');
    panel.inert = false;
    panel.removeAttribute('aria-hidden');
    archive.inert = true;
    header.inert = true;
    panel.scrollTop = 0;
    toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => open ? close() : show());
  // External links also dismiss the sheet; local routes close in navigate().
  headerNav.addEventListener('click', event => {
    if (event.target.closest('a[target="_blank"]')) { clearTimeout(tapTimer); tapTimer = setTimeout(() => close(), reduced.matches ? 0 : 190); }
  });
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
    } else if (event.key === 'Tab') {
      const targets = [...shell.querySelectorAll('a[href],button:not(:disabled)')].filter(node => node.getClientRects().length);
      const first = targets[0], last = targets.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }, true);
  function syncLayout() {
    const hadMobileFocus = shell.contains(document.activeElement);
    close(false);
    if (mobileLayout.matches) {
      panel.append(headerNav, indexPanel);
      bar.insertBefore(home, toggle);
      home.removeAttribute('data-proximity');
    } else {
      for (const { node, anchor } of anchors) anchor.after(node);
      home.dataset.proximity = '';
      if (hadMobileFocus) home.focus({ preventScroll: true });
    }
  }
  mobileLayout.addEventListener('change', syncLayout);
  syncLayout();
  return { close };
}
