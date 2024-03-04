const isUpper = (c: string) => c >= 'A' && c <= 'Z';

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 */
export function hyphenateStyleName(string: string): string {
  let output = '';
  for (let i = 0; i < string.length; i++) {
    const c = string[i];
    // Check for CSS variable prefix
    if (i === 1 && c === '-' && string[0] === '-') {
      return string;
    }

    if (isUpper(c)) {
      output += '-' + c.toLowerCase();
    } else {
      output += c;
    }
  }

  return output.startsWith('ms-') ? '-' + output : output;
}

/**
 * 将驼峰式的类名转换为连字符式
 * 
 * > hyphenateClassName('appInput')
 * < "app-input"
 * > hyphenateClassName('appInputItem')
 * < "app-input-item"
 * > hyphenateClassName('APP')
 * < "a-p-p"
 * @param string 
 * @returns 
 */
export function hyphenateClassName(string: string): string {
  return string.replace(/([A-Z])/g, '-$1').toLowerCase();
}