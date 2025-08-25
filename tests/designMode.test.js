import assert from 'assert';
import {DesignMode} from '../ui/js/core/designMode.js';

const layout = {gameId:'test', components:[], breakpoints:{}};
const engine = {breakpoint:'sm', load(){}, applyAll(){}};

const dm = new DesignMode(engine, layout);
// test snap
assert.strictEqual(dm.snap(13), 16);
assert.strictEqual(dm.snap(15), 16);

// test undo/redo
layout.foo = 1;
dm.pushState();
dm.layout.foo = 2;
dm.undoState();
assert.strictEqual(dm.layout.foo, 1);
dm.redoState();
assert.strictEqual(dm.layout.foo, 2);

console.log('designMode OK');
