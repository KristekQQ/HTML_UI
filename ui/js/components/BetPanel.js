// Panel pro výběr sázky
import {eventBus} from '../core/eventBus.js';

export default class BetPanel {
  constructor(props={}) {
    this.props = props;
    this.el = null;
  }
  static defaultSize() { return {w:400,h:80}; }
  mount(container) {
    this.el = container;
    this.el.className = 'bet-panel';
    this._render();
  }
  _render() {
    this.el.innerHTML = '';
    (this.props.denoms||[]).forEach(val => {
      const btn = document.createElement('button');
      btn.className = 'bet-panel__button';
      btn.textContent = val;
      btn.addEventListener('click', () => eventBus.emit('BET/CHANGE', val));
      this.el.appendChild(btn);
    });
  }
  unmount() {}
  update(p){ this.props = {...this.props,...p}; this._render(); }
  getBoundingBox(){ return this.el.getBoundingClientRect(); }
}
