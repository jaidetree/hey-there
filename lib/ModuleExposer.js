class ModuleExposer {
  /**
   * @constructor
   * @param {module} targetModule - Target module to setup exports of
   */
  constructor (targetModule) {
    this.module = targetModule;
  }

  /**
   * Exposes argument as the default export. Call this first
   * @example
   * let hey = require('hey-there');
   * hey(module).export(MyClassOrFunction)
   *
   * // in source
   * let myModule = require('myModule');
   * let moduleInstance = new MyModule(); // if class
   * return myModule() // if function
   */
  export (defaultExport) {
    this.module.exports = defaultExport;
  }

  /**
   * Expose map of objects to the module exports
   * @param {object} moduleExports - Map of names to export objects as.
   * @returns {object} Updated module exports
   * @example
   * let hey = require('hey-there');
   * hey(module).export(MyClassOrFunction).and.expose({
   *   buildAssets,
   *   copyAssets,
   * })
   *
   * // in source
   * let myModule = require('myModule');
   * myModule.buildAssets();
   * myModule.copyAssets();
   */
  expose (moduleExports) {
    Reflect.ownKeys(moduleExports).forEach((name) => {
      this.module.exports[name] = moduleExports[name];
    });

    return this.module.exports;
  }
}

module.exports = ModuleExposer;
