var tape = require('tape');
var async = require('async');

var test = function (name, fn, _before, _after, only, skip) {
  var before = _before || [];
  var after = _after || [];
  var testFn = only
    ? tape.only
    : skip ? tape.skip : tape;

  testFn(name, function (t) {
    var tEnd = t.end.bind(t);

    t.beforeEach = function (fn) {
      before.push(fn);
    };

    t.afterEach = function (fn) {
      after.push(fn);
    };

    t.test = function (tName, tFn, only, skip) {
      var tTestFn = only
        ? test.only
        : skip ? test.skip : test;

      tTestFn(name + ' ' + tName, function (q) {
        var qEnd = q.end.bind(q);
        var qPlan = q.plan.bind(q);
        var executedAfters = false;

        q.end = function () {
          runWrapperFns(after, function () {
            executedAfters = true;
            qEnd();
          });
        };

        q.plan = function (numberofAssertions) {
          qPlan(numberofAssertions);
        };

        q.on('end', function (num) {
          if (!executedAfters) runWrapperFns(after, function () {
            executedAfters = true;
          });
        });

        tFn(q);
      }, before.slice(0), after.slice(0));
    };

    t.test.only = function (tName, tFn) {
      return t.test(tName, tFn, true);
    };

    t.test.skip = function (tName, tFn) {
      return t.test(tName, tFn, false, true);
    };

    runWrapperFns(before, function () {
      fn(t);
    });
  });
};

test.only = function (name, fn, _before, _after) {
  return test(name, fn, _before, _after, true);
};

test.skip = function (name, fn, _before, _after) {
  return test(name, fn, _before, _after, false, true);
};

function runWrapperFns (fns, callback) {
  callback = callback || function () {};

  async.eachSeries(fns, function (fn, done) {
    fn({end: done});
  }, callback);
}

module.exports = test;
