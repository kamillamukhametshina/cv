export const spectrumSectionIds = ['outdoor', 'photowall', 'stickers', 'posters'];
export function spectrumVisibleSections(filter, mobile) {
  return !mobile || filter === 'all' ? spectrumSectionIds : spectrumSectionIds.filter(id => id === filter);
}
