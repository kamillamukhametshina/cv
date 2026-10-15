import { typography } from './typography.js?v=5';

// Measure the entire archive once per viewport, so selecting a case never moves filters.
export function setupSidebarLayout(projects, works) {
  const archive=document.querySelector('.archive'), info=document.querySelector('#project-info');
  let frame=0;
  const node=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=typography(text,{afterColon:tag==='dd'});if(cls)e.className=cls;return e;};
  function measure(){
    frame=0;
    if(innerWidth<1024)return;
    document.documentElement.style.removeProperty('--sidebar-copy-font');
    const rootStyle=getComputedStyle(document.documentElement);
    const header=parseFloat(getComputedStyle(document.body).gridTemplateRows.split(' ')[0]);
    const offset=parseFloat(rootStyle.getPropertyValue('--content-offset'));
    const probe=document.createElement('div');
    probe.className='sidebar-copy-probe';
    probe.style.width=`${info.getBoundingClientRect().width}px`;
    document.body.append(probe);
    const navProbe=document.createElement('div');
    navProbe.className='sidebar-nav-probe';
    navProbe.style.width=probe.style.width;
    document.body.append(navProbe);
    const navLists=[...projects.map(p=>(p.internalFilters||[]).map(s=>s.label)),
      ...['Диджитал контент','Презентации','Ивенты'].map(t=>works.filter(w=>w.types.includes(t)).map(w=>{
        const project=projects.find(p=>p.id===w.projectId);
        return project && project.title!==w.title ? `${project.title} / ${w.title}` : w.title;
      }))];
    let navigationHeight=0;
    for(const labels of navLists){
      const nav=document.createElement('nav');nav.className='internal-filters work-switcher';
      nav.append(...labels.map(label=>node('button',label,'work-filter')));
      navProbe.replaceChildren(nav);
      navigationHeight=Math.max(navigationHeight,nav.getBoundingClientRect().height);
    }
    navProbe.remove();
    const latestFilterTop=innerHeight-navigationHeight-66;
    const indexBottom=header+offset+projects.length*parseFloat(rootStyle.getPropertyValue('--project-row-height'))+28;
    let tallest=0, filterTop=0;
    const normalFont=parseFloat(rootStyle.getPropertyValue('--project-font-size')) || parseFloat(getComputedStyle(info).fontSize);
    // First reduce whitespace, then gently compact copy only on short desktop windows.
    const fits=[{font:normalFont,gap:20},{font:normalFont,gap:12},
      ...[.5,1,1.5,2].map(delta=>({font:Math.max(10,normalFont-delta),gap:10}))];
    for(const fit of fits){
      document.documentElement.style.setProperty('--sidebar-copy-font',`${fit.font}px`);
      document.documentElement.style.setProperty('--sidebar-copy-gap',`${fit.gap}px`);
      tallest=0;
      const candidates=projects.flatMap(p=>(p.internalFilters?.length?p.internalFilters:[{}]).map(section=>({...p,section,deadline:section.deadline||p.deadline})));
      for(const item of [...candidates,...works]){
        probe.replaceChildren();
        if(item.intro)probe.append(node('p',item.intro,'project-intro'));
        const facts=document.createElement('dl');facts.className='project-facts';
        for(const [label,value] of [['Роль:',item.role],['Задача:',item.hideTask ? '' : (item.task||item.description)],['Цифры:',item.stats]]){
          if(!value)continue;
          const row=document.createElement('div');row.append(node('dt',label),node('dd',value));facts.append(row);
        }
        probe.append(facts);
        if(item.section?.description)probe.append(node('p',item.section.description,'section-description project-intro'));
        if(item.projectId)probe.append(node('a','Смотреть в проекте →','work-project-link'));
        tallest=Math.max(tallest,probe.getBoundingClientRect().height+offset);
      }
      filterTop=Math.ceil(Math.max(header+tallest+24,indexBottom));
      if(filterTop<=latestFilterTop)break;
    }
    probe.remove();
    archive.style.setProperty('--filter-top',`${filterTop}px`);
  }
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
  window.addEventListener('resize',schedule,{passive:true});
  document.fonts.ready.then(schedule);
  measure();
  return { refresh:schedule };
}
