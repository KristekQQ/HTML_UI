// Placeholder komponenta herních válců
export default class ReelsGrid {
  constructor(props={}) {
    this.props = props;
    this.el = null;
  }
  static defaultSize() { return {w:400,h:300}; }
  mount(container) {
    this.el = container;
    this.el.classList.add('reels-grid');
    this.el.textContent = 'Reels';
    this.el.style.background = 'rgba(255,255,255,0.1)';
  }
  unmount() {}
  update(p) { this.props = {...this.props,...p}; }
  getBoundingBox() { return this.el.getBoundingClientRect(); }
}
