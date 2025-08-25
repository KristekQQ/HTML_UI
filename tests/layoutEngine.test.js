import assert from 'assert';
import {LayoutEngine} from '../ui/js/core/layoutEngine.js';

// stub global window
global.window = {
  innerWidth: 800,
  innerHeight: 600,
  addEventListener: ()=>{}
};

const layout = {
  breakpoints:{sm:0, md:600, lg:900},
  components:[{
    id:'comp', type:'ReelsGrid', zIndex:1,
    responsive:{
      sm:{x:'0%',y:'0%',w:'50%',h:'50%',anchor:'TL'},
      md:{x:'10%',y:'10%',w:'60%',h:'60%',anchor:'TL'}
    }
  }]
};

const engine = new LayoutEngine();
engine.load(layout);
const el = {style:{}};
engine.register('comp', {mount(){},getBoundingBox(){return {}}}, el);
assert.strictEqual(engine.breakpoint, 'md');
assert.strictEqual(el.style.width, '480px');

// změna viewportu
window.innerWidth = 500;
engine.load(layout);
engine.applyAll();
assert.strictEqual(engine.breakpoint, 'sm');
assert.strictEqual(el.style.width, '250px');

console.log('layoutEngine OK');
