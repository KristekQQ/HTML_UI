// Menu overlay s ikonami
import {eventBus} from '../core/eventBus.js';

export default class MenuOverlay {
  constructor(props={}) {
    this.props = props;
    this.el = null;
  }
  static defaultSize(){ return {w:60,h:240}; }
  mount(container){
    this.el = container;
    this.el.className = 'menu-overlay';
    const buttons = [
      {id:'refresh', label:'R'},
      {id:'info', label:'I'},
      {id:'settings', label:'S'},
      {id:'history', label:'H'}
    ];
    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.className = 'menu-overlay__button';
      btn.textContent = b.label;
      btn.addEventListener('click', ()=> eventBus.emit('MENU/'+b.id.toUpperCase()));
      this.el.appendChild(btn);
    });
  }
  unmount(){}
  update(p){ this.props={...this.props,...p}; }
  getBoundingBox(){ return this.el.getBoundingClientRect(); }
}
