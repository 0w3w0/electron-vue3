import { CSSObject } from '../type';
import { hyphenateStyleName } from '../utils/hyphenate';

/**
 * 合并类名
 * @description 合并类名，去掉空类名
 * @param names
 * @returns
 */
function mergeClass(...names: string[]) {
  return names.filter(Boolean).join(' ');
}

function hasParent(value: string) {
  return value.includes('&');
}

function replaceParent(value: string, parent: string) {
  return value.replace(/&/g, parent);
}

/**
 * 判断类名是否包含 ".",如果包含原样返回，否则加上 ".",
 */
export const makeClassName = (name: string) => {
  // 排除选择器：+、>、~、:、[、.
  if (/^[+>~\[:.]/.test(name)) {
    return name;
  }
  return `.${name}`;
}

/**
 * 解析css,TODO: 支持关键帧动画
 * @param css
 * @returns
 */
export function parseRule(hashId: string, cssObj: CSSObject, scoped: boolean) {
  let styles: string[] = [];
  for (const key of Object.keys(cssObj)) {
    let cls = hyphenateStyleName(key);
    cls = makeClassName(cls);
    const queue: Array<{ selector: string; rules: any }> = [
      { selector: cls, rules: cssObj[key] },
    ];
    while (queue.length > 0) {
      const { selector, rules } = queue.shift()!;
      let ruleStr = '';
      for (const [subKey, subRule] of Object.entries(rules)) {
        if (typeof subRule === 'object') {
          if (subKey.length === 0) continue;
          let newKey = subKey;
          if (hasParent(subKey)) {
            newKey = replaceParent(newKey, selector);
          } else {
            newKey = mergeClass(selector, newKey);
          }
          queue.push({ selector: newKey, rules: subRule });
        } else {
          ruleStr += `${hyphenateStyleName(subKey)}:${subRule};`;
        }
      }
      if (ruleStr.length > 0) {
        styles.push(`${selector}{${ruleStr}}`);
      }
    }
  }
  styles = styles.map((style) => {
    if (!scoped) return style;
    return `:where(.${hashId})${style}`;
  });
  return styles.join('');
}
