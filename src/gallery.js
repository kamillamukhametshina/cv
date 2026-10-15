// Flat media records remain the source for viewer order and URL state.
export function galleryModules(items) {
  const modules = [];
  for (const item of items) {
    if (item.galleryGroup) {
      let group = modules.at(-1);
      if (group?.group !== item.galleryGroup) {
        group = { group: item.galleryGroup, label: item.galleryGroupLabel || item.galleryGroup, items: [], wide: true };
        modules.push(group);
      }
      group.items.push(item);
    } else {
      modules.push({ items: [item], wide: item.gallerySpan === 2 || (item.gallerySpan !== 1 && item.width / item.height >= 1.7) });
    }
  }
  return modules;
}
