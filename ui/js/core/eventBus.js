// Jednoduchý EventBus pro komunikaci komponent
export class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, cb) {
    (this.listeners[event] || (this.listeners[event] = [])).push(cb);
  }

  off(event, cb) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(fn => fn !== cb);
  }

  emit(event, payload) {
    (this.listeners[event] || []).forEach(fn => fn(payload));
  }
}

export const eventBus = new EventBus();
