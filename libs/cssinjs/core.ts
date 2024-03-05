import { createStyleSheet } from './internal/dom';
import { parseRule } from './internal/rule';
import { CSSObject, CacheValue, StyleFn } from './types';
import { murmurhash3 } from './utils/hash';
import { hyphenateClassName } from './utils/hyphenate';

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
    key: string,
    styleFn: StyleFn<C, T>,
  ): Record<keyof ReturnType<StyleFn<C, T>>, string> & {
    classHash: string;
  } {
    let scoped = true;
    let updated = true;
    const args = {
      theme: this._theme,
      update: (update: boolean) => {
        updated = update;
      },
      scoped: (scope: boolean) => {
        scoped = scope;
      },
    };
    const cssObj = styleFn(args);
    const cacheValue = this.cache.get(key);
    if (cacheValue) {
      return cacheValue.classObject;
    }
    const classHash = `css-${murmurhash3(key)}`;
    const keys = Object.keys(cssObj) as Array<keyof C>;
    const classObj = {
      classHash,
    } as any;
    keys.forEach((key) => {
      let cls = hyphenateClassName(key as string);
      if (cls[0] === '.') {
        cls = cls.slice(1);
      }
      classObj[key] = cls;
    });
    const cssText = parseRule(classHash, cssObj, scoped);
    const element = createStyleSheet(classHash, cssText);
    const newCache: CacheValue = {
      classHash,
      classObject: classObj,
      scoped,
      updated,
    };
    if (updated) {
      newCache.element = element;
      newCache.styleFunc = styleFn;
    }
    this.cache.set(key, newCache);
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
        const cssObj = cache.styleFunc!({ theme });
        const cssText = parseRule(cache.classHash, cssObj, cache.scoped);
        cache.element!.innerHTML = cssText;
      }
    });
  }
}
