// Idempotent plain-text typography. Never processes HTML or changes URLs.
const shortWords = '(?:и|в|во|на|под|к|с|со|у|о|об|от|до|за|по|из|для|без|над|перед|при|про|через|между|около|после|по-за|из-за|из-под|не|ни|а|но|или)';
const danglingWord = new RegExp(`(?<![\\p{L}\\p{N}_])(${shortWords})[ \\t\\u00a0]+(?=\\S)`, 'giu');
export function typography(value, { afterColon = false } = {}) {
  let text = String(value ?? '');
  if (afterColon) text = text.replace(/^(\s*[«“"(]*)(\p{Lu})(?!\p{Lu})/u, (_, prefix, letter) => prefix + letter.toLowerCase());
  return text
    .replace(/(:\s+[«“"(]*)(\p{Lu})(?!\p{Lu})/gu, (_, prefix, letter) => prefix + letter.toLowerCase())
    .replace(/(?<=[\p{L}\p{N}»”")])\.(?=\s|[}»”"]?\s*$)/gu, (dot, offset, source) => {
      const before = source.slice(0, offset);
      if (/^\d{1,2}$/.test(before) && /\S/.test(source.slice(offset + 1))) return dot;
      // Keep initials and one-letter abbreviations, but not terminal sentence punctuation.
      if (/(?:^|\s)\p{L}$/u.test(before) && /\S/.test(source.slice(offset + 1))) return dot;
      return '';
    })
    .replace(danglingWord, '$1\u00a0');
}
