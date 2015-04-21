var tape = require('tape');
var test = require('../')(tape);

test('adding beforeEach and afterEach to tape', function (t) {
  
  t.equal(typeof t.beforeEach, 'function', 'beforeEach function');
  t.equal(typeof t.afterEach, 'function', 'afterEach function');
  
  t
    .beforeEach(function (t) {
    
      t.beforeEachValue = 'value';
      t.equal(typeof t.end, 'function', 'context callback');
      t.end();
    })
    .beforeEach(function (t) {
      
      t.end();
    })
    .afterEach(function (t) {
      
      t.afterEachValue = 'value';
      t.end();
    })
    .test('nested test 1', function (q) {
    
      q.equal(q.beforeEachValue, 'value', 'context passed to test runner from beforeEach');
      q.end();
    });
  
  t.test('nested test 2', function (q) {
    
    q.equal(q.beforeEachValue, 'value', 'context passed to all test runners from beforeEach');
    q.end();
  });
  
  t.end();
});