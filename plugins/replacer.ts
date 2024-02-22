export let getReplacer = (options?: {
  electronModules?: string[];
  externalsModules?: string[];
}) => {
  if (!options) options = {};
  let result = {};
  if (options.externalsModules) {
    // let externalModels = ["os", "fs", "path"];
    for (let item of options.externalsModules) {
      result[item] = () => ({
        find: new RegExp(`^${item}$`),
        code: `const ${item} = require('${item}');export { ${item} as default }`,
      });
    }
  }
  if (options.electronModules) {
    let electronModules = options.electronModules.join(',');
    result['electron'] = () => {
      // let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
      return {
        find: new RegExp(`^electron$`),
        code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
      };
    };
  }
  return result;
};
