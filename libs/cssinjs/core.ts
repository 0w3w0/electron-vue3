import { createStyleSheet } from './internal/dom';
import { parseRule } from './internal/rule';
import { CSSObject, CacheValue, StyleFn } from './type';
import { murmurhash3 } from './utils/hash';
import { hyphenateStyleName } from './utils/hyphenate';

export class CSSinJS<T=any> {
  private cache: Map<string, CacheValue> = new Map();
  private _theme: T = {} as T;
  private themeHash: string = '';
  get theme() {
    return this._theme;
  }

  constructor(opts:Partial<{
    theme: T;
  }> = {}) {
    this._theme = opts.theme || {} as T;
    this.themeHash = murmurhash3(JSON.stringify(this._theme));
  }

  createStyle<C extends CSSObject>(
    styleFn: StyleFn<C,T>,
  ): Record<keyof ReturnType<StyleFn<C,T>>, string>;
  createStyle<C extends CSSObject>(
    componentName: string,
    styleFn: StyleFn<C,T>,
    scoped?: boolean,
  ): Record<keyof ReturnType<StyleFn<C>>, string>;
  createStyle<C extends CSSObject>(
    componentNameOrStyleFn: string | StyleFn<C,T>,
    styleFnOrScoped?: StyleFn<C,T> | boolean,
    scoped = true,
  ): Record<keyof ReturnType<StyleFn<C,T>>, string> {
    let componentName: string;
    let styleFn: StyleFn<C,T>;
    let cssHashPrefix = 'css';
    if (typeof componentNameOrStyleFn === 'string') {
      componentName = componentNameOrStyleFn;
      styleFn = styleFnOrScoped as StyleFn<C,T>;
    } else {
      componentName = 'default';
      styleFn = componentNameOrStyleFn;
      cssHashPrefix = `${cssHashPrefix}-global`;
      scoped = false;
    }
    const cache = this.cache.get(componentName);
    if (cache) {
      return cache.classObject;
    }
    const classHash = `${cssHashPrefix}-${murmurhash3(componentName)}`;
    const cssObj = styleFn(this._theme);
    const keys = Object.keys(cssObj) as Array<keyof C>;
    const classObj: Record<keyof C, string> = {} as any;
    keys.forEach((key) => {
      let cls = hyphenateStyleName(key as string);
      if (cls[0] === ".") {
        cls = cls.slice(1);
      }
      classObj[key] = `${classHash} ${cls}`;
    })
    const cssText = parseRule(classHash, cssObj, scoped);
    const element = createStyleSheet(classHash, cssText);
    const newCache = {
      classHash,
      classObject: classObj,
      element,
      styleFunc: styleFn,
      scoped,
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
      const cssObj = cache.styleFunc(this._theme);
      const cssText = parseRule(cache.classHash, cssObj, cache.scoped);
      cache.element.innerHTML = cssText;
    });
  }
}