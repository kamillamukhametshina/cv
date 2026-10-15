export function createDocumentArchive(documents, openDocument) {
  const section = document.createElement('section');
  section.className = 'document-archive';
  section.setAttribute('aria-label', 'Advertalyze — цифровой архив PDF');
  documents.forEach((doc, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'archive-file';
    button.setAttribute('aria-label', `${doc.title} — кликнуть и посмотреть`);
    button.setAttribute('aria-haspopup', 'dialog');
    const meta = document.createElement('span');
    meta.className = 'archive-file-meta';
    meta.textContent = `File ${String(index + 1).padStart(3, '0')} / pdf`;
    const cover = document.createElement('img');
    cover.src = doc.cover;
    cover.alt = '';
    cover.loading = 'lazy';
    cover.decoding = 'async';
    const title = document.createElement('span');
    title.className = 'archive-file-title';
    title.textContent = doc.title;
    const count = document.createElement('span');
    count.className = 'archive-file-count';
    count.textContent = `${String(doc.pages.length).padStart(2, '0')} стр`;
    const action = document.createElement('span');
    action.className = 'archive-file-action';
    action.textContent = 'кликнуть и посмотреть ↗';
    button.append(meta, cover, title, count, action);
    button.addEventListener('click', () => openDocument(doc, button));
    section.append(button);
  });
  return section;
}
