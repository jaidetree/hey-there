let util = require('../../lib/hey')(module);

function helloWorld () {
  return `${util.hello()} ${util.world()}`
}

function hello () {
  return 'hello';
}

function world () {
  return 'world';
}

util.export(helloWorld).and.expose({
  hello,
  world,
});
