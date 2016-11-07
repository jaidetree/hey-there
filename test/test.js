let expect = require('expect');

describe('hey-there', () => {
  it('Should import a module exported with the hey function', () => {
    let helloWorld = require('./fixtures/helloWorld');

    expect(helloWorld).toBeA(Function);
    expect(helloWorld()).toBe('hello world');
  });

  it('Should allow us to spy on methods exportred with the expose method', () => {
    let helloWorld = require('./fixtures/helloWorld');
    let helloSpy = expect.spyOn(helloWorld, 'hello').andReturn('hey');
    let worldSpy = expect.spyOn(helloWorld, 'world').andReturn('there');
    // ^ that turns out to be a rather creepy combination of words

    expect(helloWorld).toBeA(Function);
    expect(helloWorld()).toBe('hey there'); // see what I did there?
    expect(helloSpy).toHaveBeenCalled();
    expect(worldSpy).toHaveBeenCalled();

    // Sorry. I'll stop now... but hey! At least it works right? RIGHT?!
  });
});
