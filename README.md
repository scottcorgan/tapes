# tapes

A more robust tap-producing test harness for node and browsers.

Adds the following to [tape]() without changing your normal workflow or adding globals:

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