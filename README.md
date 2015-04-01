# runner

A more robust tap-producing, [tape](https://github.com/substack/tape) compatible, test harness for node and browsers. This is like if [tape](https://github.com/substack/tape) did [Crossfit](http://fitnesspainfree.com/wp-content/uploads/2013/12/Hammer.jpg).

Adds the following to [tape](https://github.com/substack/tape) without changing your normal workflow or adding globals:

#### Namespacing

Instead of having awkward `describe()` and `it()` as it is in a typical BDD test runner, this runner lets you use obvious namespacing to build chains of related tests. This not only makes it easier to read the tests, but easier to read the output when used with a module like [tap-spec](https://github.com/scottcorgan/tap-spec).

```
var test = require('runner');

var namesapce = test('namespace');

namespace.test('my test', function (t) {
  
  t.end();
});

var nestedNamespace = namespace.test('nested');

nestedNamespace.test('another test', function (t) {

  t.end();  
});
```

#### beforeEach()

#### afterEach()

Each `beforeEach()` and `afterEach()` will also be called for each child/nested test (similar to [Mocha's nested suites](http://visionmedia.github.io/mocha/))

## Install

```
npm install runner --save-dev
```

### Running from the command line

```
$ runner test/**/*.js
```

or 

```
$ node test/index.js
```

### Running from withing package.json

```js
{
  "name": "my-module",
  "scripts": {
    "test": "runner test/**/*.js"
  }
}
```

## Run Tests

```
npm install
npm test
```