import { CSSProperties } from 'vue';

export type CSSObject<T = Record<string, CSSProperties>> = {
  [key in keyof T]: CSSProperties | CSSObject<T>;
};

export type StyleFn<C extends CSSObject, T = any> = (theme: T) => C;

export interface CacheValue {
  classHash: string;
  classObject: any;
  element: HTMLStyleElement;
  styleFunc: Function;
  scoped: boolean;
}
