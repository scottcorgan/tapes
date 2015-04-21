var tape = require('tape');
var test = require('../')(tape);

test('testing', function (t) {
  
  t
    .beforeEach(function (t) {
    
      t.beforeEachValue = 'value';
      t.end();
    })
    .beforeEach(function (t) {
      
      t.end();
    })
    .afterEach(function (t) {
      
      t.afterEachValue = 'value';
      t.end();
    });
  
  t.test('nested testing', function (q) {
    
    q.equal(q.beforeEachValue, 'value', 'context passed to test runner from beforeEach');
    q.end();
  });
  
  t.test('nested teseting 2', function (q) {
    
    q.equal(q.beforeEachValue, 'value', 'context passed to all test runners from beforeEach');
    q.end();
  });
  
  t.end();
});