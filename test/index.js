var test = require('../');
var assert = require('assert');

test('basic tape api support', function (t) {
  
  t.ok(true, 'this test is fine');
  t.end();
});

var namespace = test('namespace', function (t) {
  
  t.plan(1);
  t.ok(true, 'assertion plan count');
});

namespace.test('normal behavior', function (t) {
  
  t.ok(true, 'assertion in namespaced tests');
  t.end();
});

var hooks = test('hooks');

hooks.beforeEach(function (t, ctx) {
  
  ctx.someData = 'testing';
  t.end();
});

hooks.afterEach(function (t, ctx) {
  
  assert.equal(ctx.someData, 'testing', 'context data passed to afterEach');
  t.end();
});

hooks.test('beforeEach()', function (t, ctx) {
  
  t.equal(ctx.someData, 'testing', 'pass context data from before/after hooks');
  t.end();
});

hooks.test('nested context from beforEach()')
  .test('context passing', function (t, ctx) {
    
    t.equal(ctx.someData, 'testing', 'context passed down through children');
    t.end();
  })
    .test('deeper')
      .beforeEach(function (t, ctx) {
        
        ctx.moreData = 'nested';
        t.end();
      })
      .test('context passing', function (t, ctx) {
        
        t.equal(ctx.someData, 'testing', 'context passed');
        t.equal(ctx.moreData, 'nested', 'data from lower in the nested test chain');
        t.end();
      });

hooks.test.skip('skipped test', function (t) {
  
  // This shouldn't throw an error because this test is skipped
  t.plan(3);
});

test.skip('basic skip', function (t) {
  
  t.plan(3);
});