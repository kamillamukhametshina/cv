import { mobileLayout } from './responsive.js';
// Source mockups stay intact: the strap and card are separate CSS crop windows.
export function createBadges(items) {
  const element = document.createElement('div');
  element.className = 'hanging-badges';
  element.setAttribute('role', 'group');
  element.setAttribute('aria-label', 'Бейджи участников фестиваля');
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const bodies = items.map((item, index) => {
    const [x, y, w, h] = item.crop;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'hanging-badge';
    button.setAttribute('aria-label', `${item.label}: перевернуть бейдж`);
    button.setAttribute('aria-pressed', 'false');
    button.style.aspectRatio = `${w} / ${y + h}`;
    const assembly = document.createElement('span'); assembly.className = 'badge-assembly';
    const strap = document.createElement('span'); strap.className = 'badge-strap';
    strap.style.height = `${y / (y + h) * 100}%`;
    const sourceImage = () => {
      const img = document.createElement('img');
      img.src = item.front; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.draggable = false;
      img.width = 1056; img.height = 1489;
      img.style.width = `${1056 / w * 100}%`; img.style.left = `${-x / w * 100}%`;
      return img;
    };
    strap.append(sourceImage());
    const card = document.createElement('span'); card.className = 'badge-card';
    card.style.top = `${y / (y + h) * 100}%`; card.style.height = `${h / (y + h) * 100}%`;
    const front = document.createElement('span'); front.className = 'badge-face badge-front';
    const frontImage = sourceImage(); frontImage.style.top = `${-y / h * 100}%`; front.append(frontImage);
    const back = document.createElement('span'); back.className = 'badge-face badge-back';
    const [bx, by, bw, bh] = item.backCrop;
    const backImage = document.createElement('img');
    backImage.src = item.back; backImage.alt = ''; backImage.loading = 'lazy'; backImage.decoding = 'async'; backImage.draggable = false;
    backImage.style.width = `${1056 / bw * 100}%`;
    backImage.style.height = `${1489 / bh * 100}%`;
    backImage.style.left = `${-bx / bw * 100}%`;
    backImage.style.top = `${-by / bh * 100}%`;
    back.append(backImage);
    card.append(front, back); assembly.append(strap, card); button.append(assembly); element.append(button);
    const body = { button, assembly, card, angle: 0, velocity: 0, twist: 0, spin: 0, target: 0, phase: index * .67, gustAt: 5 + index * .22, flip: false, hovered: false, pointerImpulse: 0 };
    button.addEventListener('click', () => {
      body.flip = !body.flip; body.target = body.flip ? Math.PI : 0;
      button.setAttribute('aria-pressed', String(body.flip));
      if (reduced.matches) { body.twist = body.target; draw(body); }
    }, { signal: abort.signal });
    return body;
  });
  if (mobileLayout.matches) {
    const hint = document.createElement('p'); hint.className = 'mobile-object-hint badge-touch-hint';
    hint.textContent = 'Тап по бейджу — перевернуть'; element.append(hint);
  }
  const desktopHint = document.createElement('p');
  desktopHint.className = 'badge-desktop-hint';
  desktopHint.textContent = 'Наведите мышку — бейджи интерактивные';
  element.append(desktopHint);
  const byButton = new Map(bodies.map(body => [body.button, body]));
  let pointerBody = null, pointerX = 0, pointerWidth = 1;
  element.addEventListener('pointerover', event => {
    if (mobileLayout.matches || event.pointerType === 'touch' || reduced.matches) return;
    const body = byButton.get(event.target.closest('.hanging-badge'));
    if (!body || body === pointerBody) return;
    if (pointerBody) pointerBody.hovered = false;
    pointerBody = body; body.hovered = true;
    // Read geometry once on entry; pointermove only accumulates a bounded impulse.
    const rect = body.button.getBoundingClientRect();
    pointerWidth = Math.max(1, rect.width); pointerX = event.clientX;
    const direction = event.clientX < rect.left + rect.width / 2 ? 1 : -1;
    body.pointerImpulse += direction * .3;
  }, { passive: true, signal: abort.signal });
  element.addEventListener('pointermove', event => {
    if (mobileLayout.matches || !pointerBody || reduced.matches || event.pointerType === 'touch') return;
    pointerBody.pointerImpulse = Math.max(-.7, Math.min(.7, pointerBody.pointerImpulse + (event.clientX - pointerX) / pointerWidth * 1.5));
    pointerX = event.clientX;
  }, { passive: true, signal: abort.signal });
  element.addEventListener('pointerout', event => {
    if (!pointerBody || pointerBody.button.contains(event.relatedTarget)) return;
    pointerBody.hovered = false; pointerBody = null;
  }, { passive: true, signal: abort.signal });
  let raf = 0, previous = 0, time = 0, visible = false, disposed = false;
  function draw(body) {
    body.assembly.style.transform = `rotateZ(${body.angle}rad)`;
    body.card.style.transform = `rotateY(${body.twist}rad) rotateX(${body.angle * -.35}rad)`;
  }
  function allowed() { return visible && !disposed && !reduced.matches && !document.hidden && !document.documentElement.hasAttribute('data-viewer-open'); }
  function tick(now) {
    raf = 0;
    if (!allowed()) return;
    const dt = previous ? Math.min((now - previous) / 1000, .032) : 1 / 60;
    previous = now; time += dt;
    for (const body of bodies) {
      if (time >= body.gustAt) {
        body.flip = !body.flip; body.target = body.flip ? Math.PI : 0;
        body.velocity += body.flip ? .42 : -.34;
        body.spin += body.flip ? 1.1 : -.9;
        body.gustAt = time + 12 + body.phase;
        body.button.setAttribute('aria-pressed', String(body.flip));
      }
      body.velocity = Math.max(-.9, Math.min(.9, body.velocity + body.pointerImpulse));
      body.spin = Math.max(-3.2, Math.min(3.2, body.spin + body.pointerImpulse * 1.7));
      body.pointerImpulse = 0;
      // Damped pendulum + torsional spring: small wind, brief impulse, then settling.
      const breeze = Math.sin(time * 1.7 + body.phase) * .12 + Math.sin(time * .73 + body.phase) * .09 + (body.hovered ? Math.sin(time * 4.2 + body.phase) * .7 : 0);
      body.velocity += (-10 * Math.sin(body.angle) - 1.9 * body.velocity + breeze) * dt;
      body.angle += body.velocity * dt;
      body.spin += ((body.target - body.twist) * 15 - body.spin * 5.3 + breeze * .6) * dt;
      body.twist += body.spin * dt;
      draw(body);
    }
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    if (allowed() && !raf) { previous = 0; raf = requestAnimationFrame(tick); }
    else if (!allowed()) { cancelAnimationFrame(raf); raf = 0; previous = 0; }
    if (reduced.matches) bodies.forEach(body => { body.angle = 0; body.twist = body.target; draw(body); });
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(element);
  for (const event of ['visibilitychange', 'portfolio-viewer-change']) document.addEventListener(event, sync, { signal: abort.signal });
  reduced.addEventListener('change', sync, { signal: abort.signal });
  return { element, dispose() { disposed = true; cancelAnimationFrame(raf); observer.disconnect(); abort.abort(); } };
}
