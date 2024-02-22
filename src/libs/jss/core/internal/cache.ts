import { StyleFunc, StyleScope } from "../../types";

export interface CacheValue {
  element: HTMLStyleElement;
  styleFunc: StyleFunc;
  scope:StyleScope;
  className: string;
  hashId: string;
}

export class StyleCache {
  private static cache: Map<string, CacheValue> = new Map();

  static get(key: string) {
    return this.cache.get(key);
  }

  static set(key: string, value: CacheValue) {
    this.cache.set(key, value);
  }

  static forEach(callback: (value: CacheValue, key: string) => void) {
    this.cache.forEach(callback);
  }
}
