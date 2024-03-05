import { CSSProperties } from 'vue';

export type CSSObject<T = Record<string, CSSProperties>> = {
  [key in keyof T]: CSSProperties | CSSObject<T>;
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