const symbols = '01/#%*+<>[]';
const proseSymbols = 'XZWMNK';

// Keep spaces (including NBSP), punctuation and character count unchanged.
export function scrambleText(text, progress, phase = 0, stableWrap = false) {
  const chars = [...text];
  return chars.map((char, i) => {
    if (!/[\p{L}\p{N}]/u.test(char) || i / chars.length < progress || (stableWrap && /\p{N}/u.test(char))) return char;
    const alphabet = stableWrap ? proseSymbols : symbols;
    return alphabet[(i * 7 + phase * 3) % alphabet.length];
  }).join('');
}

export function setupTextScramble() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const jobs = new Map();
  let frame = 0;
  function restore(element, job) {
    for (const part of job.parts) {
      // A render may have replaced the text while the effect was running.
      if (part.node.data === part.last) part.node.data = part.original;
    }
    if (job.addedLabel && element.getAttribute('aria-label') === job.label) element.removeAttribute('aria-label');
    jobs.delete(element);
  }
  function stopAll() {
    cancelAnimationFrame(frame); frame = 0;
    for (const [element, job] of jobs) restore(element, job);
  }
  function tick(now) {
    frame = 0;
    for (const [element, job] of jobs) {
      const elapsed = now - job.start;
      if (elapsed >= job.duration || !element.isConnected || document.hidden) { restore(element, job); continue; }
      const phase = Math.floor(elapsed / 42);
      if (phase === job.phase) continue;
      job.phase = phase;
      for (const part of job.parts) {
        if (part.node.data !== part.last) continue;
        part.last = scrambleText(part.original, Math.max(0, (elapsed / job.duration - .16) / .79), phase, job.stableWrap);
        part.node.data = part.last;
      }
    }
    if (jobs.size) frame = requestAnimationFrame(tick);
  }
  function start(element, { duration = 280 } = {}) {
    if (reduced.matches || jobs.has(element) || document.hidden) return;
    // Letter-shaped glyphs preserve word boundaries in wrapping descriptions.
    const stableWrap = !!element.closest('.project-intro, .project-facts, .resume-copy');
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const parts = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (/[\p{L}\p{N}]/u.test(node.data)) parts.push({node, original:node.data, last:node.data});
    }
    if (!parts.length) return;
    const label = element.textContent;
    const addedLabel = element.matches('a, button') && !element.hasAttribute('aria-label');
    if (addedLabel) element.setAttribute('aria-label', label);
    jobs.set(element, {parts, label, addedLabel, stableWrap, duration, start:performance.now(), phase:-1});
    if (!frame) frame = requestAnimationFrame(tick);
  }
  reduced.addEventListener('change', stopAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
  window.addEventListener('blur', stopAll);
  return {start, stopAll};
}
