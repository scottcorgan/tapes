var clearRequire = require('clear-require');
clearRequire('../');

var test = require('../');
var only = test('only()');

only.test.only('just this test', function (t, ctx) {
  
  t.ok(true, 'only this test ran');
  t.end();
});

only.test('this should not get run', function (t) {
  
  t.plan(3);
});