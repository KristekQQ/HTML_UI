// Design mód pro grafiky
import {createEl} from './utils/dom.js';

export class DesignMode {
  constructor(engine, layout) {
    this.engine = engine;
    this.layout = layout;
    this.active = false;
    this.grid = null;
    this.gridSize = 8;
    this.currentEl = null;
    this.offset = {x:0,y:0};
    this.undo = [];
    this.redo = [];
  }

  toggle() {
    this.active ? this.disable() : this.enable();
  }

  enable() {
    if (this.active) return;
    this.active = true;
    this._createGrid();
    this._initComponents();
    window.addEventListener('keydown', this._onKey);
  }

  disable() {
    if (!this.active) return;
    this.active = false;
    this.grid?.remove();
    this._removeHandles();
    window.removeEventListener('keydown', this._onKey);
  }

  _onKey = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      this.save();
    }
    if (e.key === 'g') {
      this.grid.classList.toggle('hidden');
    }
    if (e.key === 'z' && e.ctrlKey) {
      this.undoState();
    }
    if (e.key === 'y' && e.ctrlKey) {
      this.redoState();
    }
  }

  _createGrid() {
    const root = document.getElementById('ui-root');
    this.grid = createEl('div', 'design-grid', root);
  }

  _initComponents() {
    for (const [id, {el}] of this.engine.components) {
      el.classList.add('designable');
      this._addHandles(el, id);
    }
  }

  _removeHandles() {
    document.querySelectorAll('.design-handle').forEach(h => h.remove());
  }

  _addHandles(el, id) {
    const handle = createEl('div', 'design-handle', el);
    handle.style.right = '-5px';
    handle.style.bottom = '-5px';
    handle.style.cursor = 'se-resize';
    handle.addEventListener('pointerdown', e => this._startResize(e, el, id));
    el.addEventListener('pointerdown', e => this._startDrag(e, el, id));
  }

  _startDrag(e, el, id) {
    if (e.target.classList.contains('design-handle')) return;
    this.currentEl = {el, id};
    this.offset.x = e.offsetX;
    this.offset.y = e.offsetY;
    this.pushState();
    const move = ev => {
      const x = this.snap(ev.clientX - this.offset.x);
      const y = this.snap(ev.clientY - this.offset.y);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      this._storeBox(id, el);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  _startResize(e, el, id) {
    e.stopPropagation();
    this.currentEl = {el, id};
    const rect = el.getBoundingClientRect();
    this.pushState();
    const move = ev => {
      const w = this.snap(ev.clientX - rect.left);
      const h = this.snap(ev.clientY - rect.top);
      el.style.width = w + 'px';
      el.style.height = h + 'px';
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      this._storeBox(id, el);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  snap(v) {
    return Math.round(v / this.gridSize) * this.gridSize;
  }

  _storeBox(id, el) {
    const rect = el.getBoundingClientRect();
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    const comp = this.layout.components.find(c => c.id === id);
    comp.responsive[this.engine.breakpoint] = {
      x: (rect.left / vpW * 100).toFixed(2) + '%',
      y: (rect.top / vpH * 100).toFixed(2) + '%',
      w: (rect.width / vpW * 100).toFixed(2) + '%',
      h: (rect.height / vpH * 100).toFixed(2) + '%',
      anchor: 'TL'
    };
  }

  save() {
    const key = 'apollo:ui:layout:' + this.layout.gameId;
    localStorage.setItem(key, JSON.stringify(this.layout));
    if (window.onSaveUiLayout) window.onSaveUiLayout(this.layout);
    alert('Layout uložen');
  }

  export() {
    const blob = new Blob([JSON.stringify(this.layout, null, 2)], {type:'application/json'});
    const a = createEl('a');
    a.href = URL.createObjectURL(blob);
    a.download = this.layout.gameId + '-layout.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  pushState() {
    this.undo.push(JSON.stringify(this.layout));
    this.redo = [];
  }

  undoState() {
    if (!this.undo.length) return;
    this.redo.push(JSON.stringify(this.layout));
    this.layout = JSON.parse(this.undo.pop());
    this.engine.load(this.layout);
    this.engine.applyAll();
  }

  redoState() {
    if (!this.redo.length) return;
    this.undo.push(JSON.stringify(this.layout));
    this.layout = JSON.parse(this.redo.pop());
    this.engine.load(this.layout);
    this.engine.applyAll();
  }
}
