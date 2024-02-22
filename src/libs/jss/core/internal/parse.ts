import { CSSObject, StyleScope } from "../../types";
import { StyleTemplateValue } from "../../types/style";
import { hyphenateClassName, hyphenateStyleName } from "../../utils";

function mergeClass(...names: string[]) {
  return names.filter(Boolean).join(" ");
}

function hasParent(value: string) {
  return value.includes("&");
}

function replaceParent(value: string, parent: string) {
  return value.replace(/&/g, parent);
}

/**
 * 解析css,TODO: 支持关键帧动画
 * @param css
 * @returns
 */
export function parseCSSObject(hashId:string,cssObj:CSSObject,styleScope:StyleScope): string {
  let rootSelector = "";
  const firstRule = { selector: rootSelector, rules: cssObj };
  const queue: Array<{ selector: string; rules: any }> = [firstRule];
  let styles: string[] = [];
  while (queue.length > 0) {
    const { selector, rules } = queue.shift()!;
    let ruleStr = "";
    for (const key in rules) {
      if (typeof rules[key] === "object") {
        if (key.length === 0) continue;
        let newKey = hyphenateClassName(key);
        if (hasParent(key)) {
          newKey = replaceParent(newKey, selector);
        } else {
          newKey = mergeClass(selector, newKey);
        }
        queue.push({ selector: newKey, rules: rules[key] });
      } else {
        ruleStr += `${hyphenateStyleName(key)}:${rules[key]};`;
      }
    }
    if (ruleStr.length > 0) {
      styles.push(`${selector}{${ruleStr}}`);
    }
  }
  if (styleScope === "local") {
    styles = styles.map((style) => {
      return `:where(.${hashId})${style}`;
    });
  }
  return styles.join("");
}


export function parseTagStyle<T extends Object>(strs:TemplateStringsArray,...values:StyleTemplateValue<T>[]):string {
  console.log(strs,values);
  return ""
}