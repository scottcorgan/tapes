var tape = require('tape');
var async = require('async');

var test = function (name, fn, _before, _after) {
  var before = _before || [];
  var after = _after || [];
  
  tape(name, function (t) {
    var tEnd = t.end.bind(t);
    
    t.beforeEach = function (fn) {
      before.push(fn);
    };
    
    t.afterEach = function (fn) {
      after.push(fn);
    };
    
    t.test = function (tName, tFn) {
      test(tName, function (q) {
        var qEnd = q.end.bind(q);
        
        q.end = function () {
          runWrapperFns(after, function () {
            qEnd();
          });
        };
        
        tFn(q);
      }, before.slice(0), after.slice(0));
    };
    
    runWrapperFns(before, function () {
      fn(t);
    });
  });
};

function runWrapperFns (fns, callback) {
  async.eachSeries(fns, function (fn, done) {
    fn({end: done});
  }, callback);
}

module.exports = test;