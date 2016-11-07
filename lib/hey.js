let ModuleExposer = require('./ModuleExposer');

/**
 * Main runner of the show. Allows you to separate your module's logic from
 * the exporting logic. While the import\export syntax is infinitely better,
 * this is my best go at a stop-gap over directly-using module.exports and
 * having to declare unnecessary classes & objects to export as.
 * @param {object} targetModule - The module var from inside the module you
 *                                want to expose parts of your source with.
 * @returns {object} A proxy instance to get exports or expose more data
 * @example
 * let util = require('hey-there')(module);
 *
 * function myMainFunction () { console.log(util.getMessage()); }
 * function getMessage () { return 'Whoo loook at me !'; }
 *
 * util.export(myMainFunction).expose({
 *   getMessage,
 * })
 */
function hey (targetModule) {
  // Proxies the ModuleExposer instance allowing getters to either reference
  // what has been exposed or making the expose methods chainable including
  // extra words to make it chainable.
  // hey(module).even.though.this.is.undefined.it.still.works.export(myClass)
  return new Proxy(new ModuleExposer(targetModule), {
    get (target, property, receiver) {
      // If trying to access the exports just return that. Keep it simple.
      if (property === 'exports') return target.module.exports;

      // If we're requesting an item in target.module.exports then return it
      if (property in target.module.exports) {
        return target.module.exports[property];
      }

      // Otherwise test to see if we're trying to call a method on the
      // module exposer class
      let result = target[property];

      // If type is a method then return a chainable function
      if (typeof result === 'function') {
        return (...args) => {
          result.call(target, ...args);
          return receiver;
        };
      }

      return receiver;
    },
  });
}

// That's right. This uses itself to export itself.
hey(module).export(hey);
