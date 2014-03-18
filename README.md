# tapes

A more robust tap-producing test harness for node and browsers.

Adds the following to [tape](https://github.com/substack/tape) without changing your normal workflow or adding globals:

* beforeEach()
* afterEach()
* better nested tests

Each `beforeEach()` and `afterEach()` will also be called for each child/nested test (similar to [Mocha's nested suites](http://visionmedia.github.io/mocha/))

## Install

```
npm install tapes --save-dev
```

## Usage

```js
var test = require('tapes');

test('a set of some tests', function (t) {
  
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
  t.test('a nested set of tests', function (t) {
    t.test('this inherits from the parent suite', function (t) {
      t.ok(true, 'is true too');
      t.end();
    });
    
    t.end();
  });
  
  t.end();
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