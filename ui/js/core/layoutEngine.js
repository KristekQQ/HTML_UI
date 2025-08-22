// Engine pro výpočet a aplikaci layoutu
import {getLayout} from './store.js';

export class LayoutEngine {
  constructor() {
    this.components = new Map();
    this.breakpoint = 'sm';
    this.safeAreas = {top:0,right:0,bottom:0,left:0};
    window.addEventListener('resize', () => this.applyAll());
  }

  load(layout) {
    this.layout = layout;
    this.breakpoints = layout.breakpoints;
    this.safeAreas = layout.safeAreas || this.safeAreas;
    this.breakpoint = this._detectBreakpoint();
  }

  register(id, component, el) {
    this.components.set(id, {component, el});
    this.applyComponent(id);
  }

  setBreakpoint(bp) {
    this.breakpoint = bp;
    this.applyAll();
  }

  _detectBreakpoint() {
    const w = window.innerWidth;
    let current = 'sm';
    for (const [bp, val] of Object.entries(this.layout.breakpoints)) {
      if (w >= val) current = bp;
    }
    return current;
  }

  applyAll() {
    for (const id of this.components.keys()) {
      this.applyComponent(id);
    }
  }

  applyComponent(id) {
    const cfg = this.layout.components.find(c => c.id === id);
    const resp = cfg.responsive[this.breakpoint];
    const {x,y,w,h} = this._calcBox(resp);
    const el = this.components.get(id).el;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.zIndex = cfg.zIndex || 1;
  }

  _calcBox(r) {
    const vpW = window.innerWidth - this.safeAreas.left - this.safeAreas.right;
    const vpH = window.innerHeight - this.safeAreas.top - this.safeAreas.bottom;
    const w = this._parse(r.w, vpW);
    const h = this._parse(r.h, vpH);
    let x = this._parse(r.x, vpW) + this.safeAreas.left;
    let y = this._parse(r.y, vpH) + this.safeAreas.top;
    // zohlednění anchoru
    const anchor = r.anchor || 'TL';
    if (anchor.includes('C')) {
      x = (vpW - w)/2 + this.safeAreas.left + this._parse(r.x, vpW);
      y = (vpH - h)/2 + this.safeAreas.top + this._parse(r.y, vpH);
    } else {
      if (anchor.includes('R')) x = vpW - w - this._parse(r.x, vpW) + this.safeAreas.left;
      if (anchor.includes('B')) y = vpH - h - this._parse(r.y, vpH) + this.safeAreas.top;
    }
    return {x,y,w,h};
  }

  _parse(v, size) {
    if (typeof v === 'number') return v;
    if (v.endsWith('%')) return parseFloat(v) / 100 * size;
    return parseFloat(v);
  }
}

export function loadLayout(defaultLayout) {
  const gameId = defaultLayout.gameId;
  const saved = localStorage.getItem('apollo:ui:layout:' + gameId);
  return saved ? JSON.parse(saved) : defaultLayout;
}
