var tape = require('tape');
var tapes = require('../');
var test = tapes(tape);

var beforeRan = false;
var afterRan = false;

test.beforeEach(function(t) {
  beforeRan = true;
  t.end();
});

test.afterEach(function (t) {
  afterRan = true;
  t.end();
});

test('set', function(t) {
  var setBeforeRan = false;
  var setAfterRan = false;

  t.beforeEach(function (t) {
    setBeforeRan = true;
    t.end();
  });

  t.afterEach(function (t) {
    setAfterRan = true;
    t.end();
  });

  t.test('test1', function(t) {
    t.true(beforeRan, 'A beforeEach function ran for this set.');
    t.true(setBeforeRan, 'A beforeEach function ran for this test.');
    t.end();
  });

  t.test('test2', function(t) {
    t.true(setAfterRan, 'An afterEach function ran for test1');
    t.end();
  });

  t.end();
});
