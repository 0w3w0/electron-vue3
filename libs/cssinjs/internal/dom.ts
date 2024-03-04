export function createStyleSheet(hashId:string,cssText:string) {
  const element = document.createElement('style');
  element.setAttribute('data-css-hash', hashId);
  element.innerHTML = cssText;
  document.head.appendChild(element);
  return element;
}

export function hasStyleSheet(hashId:string) {
  return !!document.querySelector(`style[data-css-hash="${hashId}"]`);
}