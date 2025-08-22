// Jednoduchá toast zpráva
export default class Toast {
  constructor(props={}) {
    this.props = props;
    this.el = null;
  }
  static defaultSize(){ return {w:200,h:40}; }
  mount(container){
    this.el = container;
    this.el.className = 'toast';
  }
  show(msg, timeout=2000){
    this.el.textContent = msg;
    this.el.classList.add('toast--visible');
    clearTimeout(this._t);
    this._t = setTimeout(()=> this.hide(), timeout);
  }
  hide(){ this.el.classList.remove('toast--visible'); }
  unmount(){}
  update(p){ this.props={...this.props,...p}; }
  getBoundingBox(){ return this.el.getBoundingClientRect(); }
}
