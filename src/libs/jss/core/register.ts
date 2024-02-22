import { StyleFunc, StyleScope } from '../types';
import { murmurhash3 } from '../utils';
import { StyleCache, createStyleSheet, parseCSSObject } from './internal';

export function createStyle(key: string,css: StyleFunc, scope: StyleScope = 'local') {
  // hashId
  const hashId = `css-${murmurhash3(key)}`;
  // 判断key是否存在
  let cacheValue = StyleCache.get(hashId);
  if (!cacheValue) {
    // 获取style
    const style = css();
    // 解析style
    const cssString = parseCSSObject(hashId, style, scope);
    // 创建style标签
    const styleTag = createStyleSheet(hashId, cssString);
    // 解析className
    const className = Object.keys(style)
      .map((v) => {
        if (v.startsWith('.')) return v.slice(1);
        return v;
      })
      .join(' ');
    // 设置style
    cacheValue = {
      element: styleTag,
      styleFunc: css,
      scope,
      className,
      hashId,
    };
    StyleCache.set(key, cacheValue);
  }
  return [hashId, cacheValue.className];
}

export function updateStyle() {
  StyleCache.forEach((value, _) => {
    const style = value.styleFunc();
    console.log('style', style);
    const cssString = parseCSSObject(value.hashId, style, value.scope);
    value.element.innerHTML = cssString;
  });
}
