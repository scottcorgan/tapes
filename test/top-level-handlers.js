var tape = require('tape');
var tapes = require('../');
var test = tapes(tape);

var beforeRan = false;
var afterRan = false;

test.beforeEach(function (t) {
  beforeRan = true;
  t.end();
});

test.afterEach(function (t) {
  afterRan = true;
  t.end();
});

test('Top-level test1', function (t) {
  t.true(beforeRan, 'A beforeEach function ran before I did.');
  t.false(afterRan, 'No afterEach functions have run yet.');
  t.end();
});

test('Top-level test2', function (t) {
  t.true(afterRan, 'The previous test\'s afterEach function ran.');
  t.end();
});