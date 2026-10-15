import { freeWorks } from './free-works.js?v=3';
import { workCovers } from './work-covers.js?v=2';
import { standaloneCopy } from './site-copy.js';
import { archiveCases } from './archive-case-data.js?v=5';
import { digitalWorks } from './digital-work-data.js?v=8';
// A curated archive of the same canonical media used by the project cases.
export const workTypes = ['Все', 'Диджитал контент', 'Презентации', 'Ивенты', 'Произвольное'];
export const typeContexts = {
  'Все': 'Работы из проектов и самостоятельные задачи.',
  'Диджитал контент': 'Визуальный контент и коммуникации брендов.',
  'Презентации': 'Презентации, системы слайдов и материалы для выступлений.',
  'Ивенты': 'Визуальное оформление событий.',
  'Произвольное': 'Плакаты, коллажи, анимация и видео.',
};
export const legacyTypes = {
  'Произвольные работы': 'Произвольное',
  'Коммуникации / креативы': 'Диджитал контент', 'Коммуникационный дизайн': 'Диджитал контент',
  'SMM / Content': 'Диджитал контент', 'Digital / Motion': 'Диджитал контент',
  'Брендинг': 'Диджитал контент', 'Бренд-системы': 'Диджитал контент', 'Print / OOH': 'Все', 'Другое': 'Все', 'Околодизайнерское': 'Все',
};
const P = 'Презентации';
export const standaloneWorkItems = [...digitalWorks, ...archiveCases, ...freeWorks].map(work => ({...work, ...standaloneCopy[work.id], ...(workCovers[work.id] ? {cover:workCovers[work.id],animatedCover:true,coverPosition:'center'} : {}), description:standaloneCopy[work.id]?.task || work.description}));
export function createWorkItems(projects, standalone = standaloneWorkItems) {
  const byId = Object.fromEntries(projects.map(project => [project.id, project]));
  const result = [];
  const add = (projectId, slug, title, types, media, description, internalFilterId, options = {}) => {
    const unique = [...new Set(media.filter(Boolean))];
    result.push({ id: `${projectId}-${slug}`, title, projectId, types, year: byId[projectId].year ?? null,
      media: unique, cover: unique.find(item => item.type === 'image') || unique[0], description,
      order: 10 + result.length, internalFilterId, layout: 'grid', ready: true, ...options });
  };
  const bitrix = byId.bitrix24;
  for (const section of bitrix.internalFilters) {
    add(bitrix.id, section.id, section.label, [P], section.media, section.description || 'Дизайн презентации и слайдов.', section.id, {deadline:section.deadline});
  }
  const fresh = byId['fresh-auto'];
  const template = fresh.internalFilters.find(section => section.id === 'template');
  add(fresh.id, 'template', 'Система презентаций', [P], template.media,
    'Типографика, сетка, обложки, разделители, слайды и диаграммы.', 'template', { cover: template.blocks[1].media[0] });
  const nml = byId['new-media-lab'];
  add(nml.id, 'presentation', 'Презентация «Вертикальный формат»', [P], nml.internalFilters.find(section => section.id === 'presentation').media,
    'Презентация образовательного конкурса коротких видеороликов.', 'presentation', { layout: 'stacked' });
  const fd = byId['f-date-eat'];
  for (const section of fd.internalFilters.filter(section => section.id !== 'other')) {
    add(fd.id, section.id, section.label, [P], section.media,
      'Презентация с обновлённым визуальным языком F Date&Eat.', section.id, { layout: 'stacked' });
  }
  for (const work of result) {
    if (workCovers[work.id]) Object.assign(work, {cover:workCovers[work.id],animatedCover:true,coverPosition:'center'});
    const project = byId[work.projectId];
    work.intro = project.intro; work.role = project.role;
    work.task = project.id === 'bitrix24' ? work.description : project.task;
  }
  return [...result, ...standalone].sort((a, b) => a.order - b.order);
}
