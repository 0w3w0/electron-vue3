export interface CacheValue {
  classHash: string;
  classObject: any;
  element?: HTMLStyleElement;
  styleFunc?: Function;
  scoped: boolean;
  updated: boolean;
}
