# tapes

A more robust tap-producing test harness for node and browsers.

Adds the following to a provided [tape](https://github.com/substack/tape) instance without changing your normal workflow or adding globals:

* beforeEach()
* afterEach()
* better nested tests

Each `beforeEach()` and `afterEach()` will also be called for each child/nested test (similar to [Mocha's nested suites](http://visionmedia.github.io/mocha/))

## Install

```
npm install tapes --save-dev
```

## Usage

Whatever values you set on the context (usually `t`) passed into the `beforeEach` and `afterEach` functions will get passed to the nested tests. Also, everything is chainable.

```js
var tape = require('tape');
var test = require('tapes')(tape); // Pass in your flavor of tape/tap

test('a set of some tests', function (t) {
  
  // FINALLY!
  t
    .beforeEach(function (t) {
    
      // do some set up for each test
      
      t.someCustomValue = 'my value';
      t.end();
    })
    .afterEach(function (t) {
    
      // do some tear down for each test
      t.end();
    });

  t.test('testing something', function (t) {
  
    t.equal(t.myCustomValue, 'my value', 'access to the context object');
    t.end();
  });
  
  t.end();
});
```

## Methods

### test(name, callback)

Create a new tests, exactlty the same as tapes's test() command.

The callback is passed the normal instance of the `Tape` class in order to create tests, setups and teardowns.

### t.beforeEach(callback)

Do setup for the current test suite. The callback will be passed an object with and `end()` method. This must be called to conclude the setup.

### t.afterEach(callback)

Do teardown for the current etst suite. The callback will be passed an object with and `end()` method. This must be called to conclude the teardown.

### t.test(name, callback)

Create a new test within the current test. This method acts exactly like [tape's](https://github.com/substack/tape) normal [`test` method](https://github.com/substack/tape#testname-cb). Each of these nested tests also has availbe the `beforeEach()` and `afterEach()` functions.

## Assertions

All of [tape's](https://github.com/substack/tape) assertions are available. Please see [tape's documentation](https://github.com/substack/tape#tokvalue-msg) for a complete list.

## License

MIT