import { createStyleSheet } from './internal/dom';
import { parseRule } from './internal/rule';
import { CSSObject, CacheValue, StyleFn } from './type';
import { murmurhash3 } from './utils/hash';
import { hyphenateStyleName } from './utils/hyphenate';

export class CSSinJS<T = any> {
  private cache: Map<string, CacheValue> = new Map();
  private _theme: T = {} as T;
  private themeHash: string = '';
  get theme() {
    return this._theme;
  }

  constructor(
    opts: Partial<{
      theme: T;
    }> = {},
  ) {
    this._theme = opts.theme || ({} as T);
    this.themeHash = murmurhash3(JSON.stringify(this.theme));
  }

  createStyle<C extends CSSObject>(
    componentName: string,
    styleFn: StyleFn<C, T>,
    opts:Partial<{
      scoped: boolean;
      updated: boolean;
    }>
  ): Record<keyof ReturnType<StyleFn<C, T>>, string> {
    opts??={};
    opts.scoped??=true;
    opts.updated??=true;
    const cacheValue = this.cache.get(componentName);
    if (cacheValue) {
      return cacheValue.classObject;
    }
    const classHash = `css-${murmurhash3(componentName)}`;
    const cssObj = styleFn(this.theme);
    const keys = Object.keys(cssObj) as Array<keyof C>;
    const classObj: Record<keyof C, string> = {} as any;
    keys.forEach((key) => {
      let cls = hyphenateStyleName(key as string);
      if (cls[0] === '.') {
        cls = cls.slice(1);
      }
      classObj[key] = `${classHash} ${cls}`;
    });
    const cssText = parseRule(classHash, cssObj, opts.scoped);
    const element = createStyleSheet(classHash, cssText);
    const newCache = {
      classHash,
      classObject: classObj,
      element,
      styleFunc: styleFn,
      scoped:opts.scoped,
      updated:opts.updated,
    };
    this.cache.set(componentName, newCache);
    return classObj;
  }

  updateTheme(theme: T) {
    const themeHash = murmurhash3(JSON.stringify(theme));
    if (themeHash === this.themeHash) {
      return;
    }
    this._theme = theme;
    this.themeHash = themeHash;
    this.cache.forEach((cache) => {
      if (cache.updated) {
        const cssObj = cache.styleFunc(this._theme);
        const cssText = parseRule(cache.classHash, cssObj, cache.scoped);
        cache.element.innerHTML = cssText;
      }
    });
  }
}
