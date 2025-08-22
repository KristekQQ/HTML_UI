// Panel pro auto-start
import {eventBus} from '../core/eventBus.js';

export default class AutoStartPanel {
  constructor(props={}) {
    this.props = props;
    this.el = null;
  }
  static defaultSize(){ return {w:200,h:80}; }
  mount(container){
    this.el = container;
    this.el.className = 'auto-start-panel';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 1;
    input.value = 10;
    const btn = document.createElement('button');
    btn.textContent = 'Auto';
    btn.addEventListener('click', ()=> {
      eventBus.emit('AUTO/START', parseInt(input.value,10));
    });
    this.el.appendChild(input);
    this.el.appendChild(btn);
  }
  unmount(){}
  update(p){ this.props = {...this.props,...p}; }
  getBoundingBox(){ return this.el.getBoundingClientRect(); }
}
