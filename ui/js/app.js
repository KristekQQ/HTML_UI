// Inicializace aplikace UI
import {setLayout} from './core/store.js';
import {LayoutEngine, loadLayout} from './core/layoutEngine.js';
import {DesignMode} from './core/designMode.js';

async function init() {
  const res = await fetch('./ui-layout.default.json');
  const layout = await res.json();
  setLayout(layout);
  const finalLayout = loadLayout(layout);

  const engine = new LayoutEngine();
  engine.load(finalLayout);
  const root = document.getElementById('ui-root');

  for (const compCfg of finalLayout.components) {
    const module = await import(`./components/${compCfg.type}.js`);
    const instance = new module.default(compCfg.props || {});
    const el = document.createElement('div');
    el.className = 'ui-component';
    el.id = compCfg.id;
    root.appendChild(el);
    instance.mount(el);
    engine.register(compCfg.id, instance, el);
  }

  const design = new DesignMode(engine, finalLayout);
  const params = new URLSearchParams(location.search);
  if (params.get('uiDesign') === '1' || window.__APOLLO_UI_FLAGS__?.designMode) {
    design.enable();
  }

  document.getElementById('btn-design').addEventListener('click', () => design.toggle());
  document.getElementById('btn-save').addEventListener('click', () => design.save());
  document.getElementById('btn-export').addEventListener('click', () => design.export());
  document.getElementById('btn-breakpoint').addEventListener('click', () => {
    const order = ['sm', 'md', 'lg'];
    const idx = (order.indexOf(engine.breakpoint) + 1) % order.length;
    engine.setBreakpoint(order[idx]);
    if (design.active) { design.disable(); design.enable(); }
  });

  window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
      design.toggle();
    }
  });
}

init();
