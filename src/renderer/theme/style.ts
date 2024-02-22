import { CSSObject, styleRegister } from '@libs/cssinjs';
import { FullToken } from './interface';
import { useToken, useTokenHash } from './token';
import { computed } from 'vue';

export type StyleFunc= (
  token: FullToken,
) => CSSObject;

export function useStyle(
  cmpName: string,
  styleFunc: StyleFunc,
  options: { scope: 'global' | 'local' }={ scope:'local' },
) {
  const token = useToken();
  const tkenHash = useTokenHash();
  return computed(()=>{
    const cssObj = styleFunc(token?.value!);  
    const {hashId,className} =styleRegister({
      componentKey: cmpName,
      cssObj,
      tokenHash: tkenHash?.value,
      styleScope: options.scope,
    });
    return [hashId,className]
  });
}
