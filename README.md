# tapes

A more robust tap-producing test harness for node and browsers.

Adds the following to [tape](https://github.com/substack/tape) without changing your normal workflow or adding globals:

* suites/nested tests (betters serparation of test subjects)
* beforeEach()
* afterEach()

## Install

```
npm install tapes --save-dev
```

## Usage

```js
var suite = require('tapes');

suite('a set of some tests', function (t) {
  
  // FINALLY!
  t.beforeEach(function (t) {
    // do some set up for each test
    t.end();
  });
  
  t.afterEach(function (t) {
    // do some tear down for each test
    t.end();
  });
  
  t.test('testing something', function (t) {
    t.ok(true, 'is true');
    t.end();
  });
  
  // SWEET!
  t.suite('a nested set of tests', function (t) {
    t.test('this inherits from the parent suite', function (t) {
      t.ok(true, 'is true too');
      t.end();
    });
  });
});
```

### Running from the command line

```
$ node test/index.js
```

### Running from withing package.json

```js
{
  "name": "my-module",
  "scripts": {
    "test": "tapes test/**/*.js"
  }
}
```

## Methods

### suite(name, callback)

Create a new suite of tests. No need to call `t.end()` on a test suite; suite will automatically end after all test have finished.

The callback is passed the normal instance of the `Tape` class in order to create tests, setups, teardowns, and nested suites. This suite instance does not provide assertion methods, but they are available inside of suite tests.

### t.beforeEach(callback)

Do setup for the current test suite. The callback will be passed an object with and `end()` method. This must be called to conclude the setup.

### t.afterEach(callback)

Do teardown for the current etst suite. The callback will be passed an object with and `end()` method. This must be called to conclude the teardown.

### t.test(name, callback)

Create a new test within the current suite. This method acts exactly like [tape's](https://github.com/substack/tape) normal [`test` method](https://github.com/substack/tape#testname-cb). You cannot create suites within tests.

## Assertions

All of [tape's](https://github.com/substack/tape) asserts are available. Please see [tape's documentation](https://github.com/substack/tape#tokvalue-msg) for a complete list.