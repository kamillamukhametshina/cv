let serial = 0;
const ns = 'http://www.w3.org/2000/svg';
function svgNode(name, attributes = {}) {
  const node = document.createElementNS(ns, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
}

// Reveal highlights first, then midtones and shadows, using the actual image luminance.
// Source alpha is composited back in, so no rectangular backing can appear.
export function setupLumaReveal(row, root = null) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const svg = svgNode('svg', { width: 0, height: 0, 'aria-hidden': 'true' });
  svg.classList.add('fresh-luma-defs');
  const defs = svgNode('defs');
  const images = [...row.querySelectorAll('img')];
  const functions = images.map(img => {
    const id = `fresh-luma-${++serial}`;
    const filter = svgNode('filter', { id, x: 0, y: 0, width: 1, height: 1, 'color-interpolation-filters': 'sRGB' });
    const luma = svgNode('feColorMatrix', { in: 'SourceGraphic', type: 'matrix', values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .2126 .7152 .0722 0 0', result: 'luma' });
    const transfer = svgNode('feComponentTransfer', { in: 'luma', result: 'reveal' });
    const alpha = svgNode('feFuncA', { type: 'linear', slope: 8, intercept: -8 });
    transfer.append(alpha);
    filter.append(luma, transfer, svgNode('feComposite', { in: 'SourceGraphic', in2: 'reveal', operator: 'in' }));
    defs.append(filter);
    // Hide synchronously, before the row is mounted or the source decodes.
    img.style.opacity = '0';
    img.style.filter = `url(#${id})`;
    return alpha;
  });
  svg.append(defs);
  row.append(svg);
  let visible = false, ready = false, disposed = false, raf = 0, started = null;
  const paused = () => document.hidden || reduced.matches || document.documentElement.hasAttribute('data-viewer-open');
  function hide() {
    functions.forEach(fn => fn.setAttribute('intercept', '-8'));
    images.forEach(img => { img.style.opacity = '0'; });
  }
  function full() {
    functions.forEach(fn => fn.setAttribute('intercept', '1'));
    images.forEach(img => { img.style.opacity = '1'; });
  }
  function tick(time) {
    raf = 0;
    if (disposed || !visible || !ready || paused()) return;
    if (started === null) started = time;
    const phase = (time - started) % 6500;
    functions.forEach((fn, index) => {
      const reveal = Math.max(0, Math.min(1, (phase - index * 120) / 1550));
      fn.setAttribute('intercept', String(-8 + reveal * 9));
      images[index].style.opacity = String(phase > 5750 ? Math.max(0, 1 - (phase - 5750) / 650) : 1);
    });
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(raf); raf = 0;
    if (reduced.matches) full();
    else if (visible && ready && !paused() && !disposed) raf = requestAnimationFrame(tick);
  }
  const visibility = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) { started = null; if (!reduced.matches) hide(); }
    sync();
  }, { root, threshold: 0.12 });
  visibility.observe(row);
  const viewer = new MutationObserver(sync);
  viewer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-viewer-open'] });
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if (reduced.matches) full();
  images.forEach(img => { img.loading = 'eager'; });
  Promise.all(images.map(img => img.decode().catch(() => {}))).then(() => {
    ready = true;
    sync();
  });
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    visibility.disconnect(); viewer.disconnect(); reduced.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);
  };
}
