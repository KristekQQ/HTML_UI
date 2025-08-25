// Pár pomocných funkcí pro práci s DOM
export function createEl(tag, className, parent) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (parent) parent.appendChild(el);
  return el;
}

export function qs(sel, parent=document) {
  return parent.querySelector(sel);
}
