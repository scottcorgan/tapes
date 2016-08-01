var tape = require('tape');
var tapes = require('../');
var test = tapes(tape);

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

    t.beforeEach(function (t) {
      // Runs parent beforeEach() function as well as this one, in sequence.
      t.end();
    });

    t.test('this inherits from the parent suite', function (t) {
      t.ok(true, 'is true too');
      t.end();
    });

    t.end();
  });

  t.end();
});
