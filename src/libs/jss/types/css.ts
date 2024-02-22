import { CSSProperties } from "vue";

export type CSSObject = {
  [K in keyof CSSProperties]?: string | number;
}| {
  [key: string]: CSSObject;
};

export type StyleFunc = () => CSSObject;
