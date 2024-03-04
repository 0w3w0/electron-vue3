import { CSSProperties } from 'vue';

export type CSSObject<T = Record<string, CSSProperties>> = {
  [key in keyof T]: CSSProperties | CSSObject<T>;
};

export type StyleValue<T> = {
  key: string;
  css: CSSObject<T>;
  scoped?: boolean;
  updated?: boolean;
};

type BoolFn = (value: boolean) => void;

export type StyleFn<C extends CSSObject, T = any> = ({
  theme,
  update,
  scoped,
}: {
  theme: T;
  update: BoolFn;
  scoped: BoolFn;
}) => C;

export interface CacheValue {
  classHash: string;
  classObject: any;
  element?: HTMLStyleElement;
  styleFunc?: Function;
  scoped: boolean;
  updated: boolean;
}
