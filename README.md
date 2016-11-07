# Hey There [![Travis](https://img.shields.io/travis/jayzawrotny/hey-there.svg)](https://travis-ci.org/jayzawrotny/hey-there) [![node](https://img.shields.io/badge/node-7.x.x-brightgreen.svg)](https://nodejs.org/en/) [![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/hey-there)

A simple exporting wrapper using the best ES6 & Node 6+ has to offer.

## Installation

```bash
npm install hey-there
```

## Usage
```js
let multiplyBy10 = require('./multiplyBy10');
let util = require('hey-there')(module);

function mainFunc (x) {
  return util.multiplyBy10(x + 1);
}

util.export(mainFunc).expose({
  multiplyBy10,
});

```

## Disclaimer
This solution is meant to be a stop-gap between current `module.exports` functionality & the upcoming `import` `export` functionality. If it is underseriable to compile with Babel but using `module.exports` feels too limited this tool can allow you to write simpler, easily tested code without having to create unnecessary classes or objects with method properties requiring more precise syntax, nesting, and commas.

When `import` & `export` are supported natively in node this package will no longer be of use as I believe we can all agree that using built in syntax is generally the better way to go. But for now this module makes using the current node implementation a little bit better.

## Problem
Have you ever written JS code that creates simple functions that call internal functions and want to stub those out for testing?

With Babel and the new module syntax using `export` and `import` it's quite trivial! As of Node 7 it's rather unwieldy to do that. For example let's say you've written:

```js
let _ = require('highland');
let buildAssets = require('./buildAssets');
let copyAssets = require('./copyAssets');
let updateBuildEntry = require('./helpers/updateBuildEntry');

function build (stream) {
  return stream
    .through(runBuildMethod)
    .flatMap(updateBuildEntry('complete'));
}

module.exports = build;

//////////////////////////////////////////////////////////////////////////////
// HELPER METHODS
//////////////////////////////////////////////////////////////////////////////

function runBuildMethod (stream) {
  return stream.flatMap((state) => {
    let stateStream = _.of(state);

    switch (state.get('action')) {
      case 'build':
        return stateStream.through(buildAssets);

      case 'copy':
        return stateStream.through(copyAssets);
    }
  });
}

module.exports.runBuildMethod = runBuildMethod;
```

Now in your test you want to stub out a function like buildAssets in a mocha unit test. Well in that setup: you can't! Even if you spy on the module.exports.runBuildMethod you're just replacing the pointer and the original function will still be called.

Enter hey-there. Now we can structure our app as such:

```js
let _ = require('highland');
let buildAssets = require('./buildAssets');
let copyAssets = require('./copyAssets');
let updateBuildEntry = require('./helpers/updateBuildEntry');
let util = require('hey-there')(module);

function build (stream) {
  return stream
    .through(util.runBuildMethod)
    .flatMap(updateBuildEntry('complete'));
}

//////////////////////////////////////////////////////////////////////////////
// HELPER METHODS
//////////////////////////////////////////////////////////////////////////////

function runBuildMethod (stream) {
  return stream.flatMap((state) => {
    let stateStream = _.of(state);

    switch (state.get('action')) {
      case 'build':
        return stateStream.through(util.buildAssets);

      case 'copy':
        return stateStream.through(util.copyAssets);
    }
  });
}

util.export(build).and.expose({
  buildAssets,
  copyAssets,
  runBuildMethod,
  updateBuildEntry,
});
```

Now you can spy on any of those internal functions in your unit tests without having to structure your code in an object or turn your function declarations into function expressions on the module.exports object

Spying example:

```js
let expect = require('expect');
let build = require('../lib/build');

describe('build', () => {
  it('Should run the build pipeline', () => {
    let spy = expect.spyOn(build, 'runBuildMethod');

    expect(build()).toExist(); // is true
    expect(spy).toHaveBeenCalled(); // is true
  });
});
```
