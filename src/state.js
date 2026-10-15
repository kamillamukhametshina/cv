import { projects, workTypes, workItems } from './data.js?v=83';
import { legacyTypes } from './work-items.js?v=20';
export const matches = (item, type) => type === 'Все' || item.types.includes(type);
export const worksForType = type => workItems.filter(item => matches(item, type));
export function normalizeState(input = {}) {
  const mode = input.mode === 'type' ? 'type' : 'project';
  const requestedType = legacyTypes[input.selectedType] || input.selectedType;
  const selectedType = mode === 'type' && workTypes.includes(requestedType) ? requestedType : 'Все';
  const project = projects.find(project => project.id === input.selectedProject) || projects[0];
  const internal = project.internalFilters || [];
  return {
    mode,
    selectedProject: mode === 'project' ? project.id : null,
    selectedType,
    selectedWorkItem: mode === 'type' && selectedType === 'Произвольное' ? 'free-collection' : mode === 'type' && worksForType(selectedType).some(item => item.ready !== false && item.id === input.selectedWorkItem) ? input.selectedWorkItem : null,
    selectedInternalFilter: mode === 'project' ? (project.id === 'spectrum' && input.selectedInternalFilter === 'all' ? 'all' : internal.find(filter => filter.id === input.selectedInternalFilter)?.id || internal[0]?.id || null) : null,
    view: ['home', 'resume'].includes(input.view) ? input.view : 'projects',
  };
}
export const defaultState = () => normalizeState();
export const typeSlugs = { 'Все':'all', 'Диджитал контент':'digital', 'Презентации':'presentations', 'Ивенты':'events', 'Произвольное':'free' };
export function readState(search, hash = '') {
  if (hash.startsWith('#/')) {
    const parts = hash.slice(2).split('/').filter(Boolean);
    if (parts[0] === 'resume') return normalizeState({view:'resume'});
    if (parts[0] === 'projects') return normalizeState({selectedProject:parts[1], selectedInternalFilter:parts[2]});
    if (parts[0] === 'works') return normalizeState({mode:'type', selectedType:Object.keys(typeSlugs).find(type => typeSlugs[type] === parts[1]), selectedWorkItem:parts[2]});
  }
  const params = new URLSearchParams(search);
  // Old category URLs with project=none remain readable.
  const typeMode = params.get('mode') === 'type' || (params.get('mode') !== 'project' && params.has('type') && (!params.has('project') || params.get('project') === 'none'));
  return normalizeState({
    mode: typeMode ? 'type' : 'project', selectedProject: params.get('project'),
    selectedType: params.get('type'), selectedWorkItem: params.get('work'),
    selectedInternalFilter: params.get('internal'), view: params.get('view') || (['mode','project','type','work','internal'].some(key => params.has(key)) ? 'projects' : 'home'),
  });
}
export function stateURL(state, href) {
  const url = new URL(href);
  url.search = '';
  if (state.view === 'home') url.hash = '';
  else if (state.view === 'resume') url.hash = '/resume';
  else if (state.mode === 'type') url.hash = '/works/' + (typeSlugs[state.selectedType] || 'all') + (state.selectedWorkItem ? '/' + state.selectedWorkItem : '');
  else url.hash = '/projects/' + state.selectedProject + (state.selectedInternalFilter ? '/' + state.selectedInternalFilter : '');
  return url;
}
