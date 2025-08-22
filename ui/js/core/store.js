// Jednoduchý store pro uchování flagů a layoutu
const state = {
  flags: {},
  layout: null
};

export function setFlag(key, val) {
  state.flags[key] = val;
}

export function getFlag(key) {
  return state.flags[key];
}

export function setLayout(layout) {
  state.layout = layout;
}

export function getLayout() {
  return state.layout;
}
