import { ComputedRef, InjectionKey, inject, ref } from "vue";
import { FullToken } from "./interface";
import { themeToken } from "./themes";

export const tokenInjectKey = Symbol() as InjectionKey<ComputedRef<FullToken>>
export function useToken() {
  return inject(tokenInjectKey,ref(themeToken));
}

const tokenHashInjectKey = Symbol() as InjectionKey<ComputedRef<string>>;
const defaultTokenHash = 'defaultTokenHash';
export function useTokenHash() {
  return inject(tokenHashInjectKey,ref(defaultTokenHash));
}