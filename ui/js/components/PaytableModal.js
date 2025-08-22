// Modal s výplatní tabulkou
import {eventBus} from '../core/eventBus.js';

export default class PaytableModal {
  constructor(props={}) {
    this.props = props;
    this.el = null;
  }
  static defaultSize(){ return {w:300,h:300}; }
  mount(container){
    this.el = container;
    this.el.className = 'paytable-modal';
    this.el.style.display = 'none';
    this.el.style.background = 'rgba(0,0,0,0.8)';
    this.el.style.color = '#fff';
    const close = document.createElement('button');
    close.textContent = 'X';
    close.addEventListener('click', () => this.hide());
    const content = document.createElement('div');
    content.textContent = 'Paytable';
    this.el.appendChild(close);
    this.el.appendChild(content);
    eventBus.on('UI/OPEN_PAYTABLE', () => this.show());
    document.addEventListener('keydown', e=> { if(e.key==='Escape') this.hide(); });
  }
  show(){ this.el.style.display='block'; }
  hide(){ this.el.style.display='none'; }
  unmount(){}
  update(p){ this.props={...this.props,...p}; }
  getBoundingBox(){ return this.el.getBoundingClientRect(); }
}
