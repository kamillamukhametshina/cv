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
export function readState(search) {
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
  for (const key of ['mode', 'project', 'type', 'work', 'view', 'internal']) url.searchParams.delete(key);
  if (state.view === 'home' || state.view === 'resume') {
    url.searchParams.set('view', state.view);
    url.hash = '';
    return url;
  }
  if (state.mode === 'type') {
    url.searchParams.set('mode', 'type');
    url.searchParams.set('type', state.selectedType);
    if (state.selectedWorkItem) url.searchParams.set('work', state.selectedWorkItem);
  } else {
    url.searchParams.set('project', state.selectedProject);
    if (state.selectedInternalFilter) url.searchParams.set('internal', state.selectedInternalFilter);
  }
  url.hash = '';
  return url;
}
