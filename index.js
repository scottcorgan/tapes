var async = require('async');

var delimiter;

function tapes (tape, opts) {
  // Allow consumers of `tapes` to patch the core `tape` library.
  test.Test = tape.Test;

  var before = [];
  var after = [];

  delimiter = opts && opts.delimiter || ' ';

  testRunner.only = function (name, fn, _before, _after) {
    return test(tape, name, fn, _before, _after, true);
  };

  testRunner.skip = function (name, fn, _before, _after) {
    return test(tape, name, fn, _before, _after, false, true);
  };

  testRunner.beforeEach = function (fn) {
    before.push(fn);
  };

  testRunner.afterEach = function (fn) {
    after.push(fn);
  };

  function testRunner(name, fn, _before, _after, only, skip) {
    if (_before) {
      before.concat(_before);
    }
    if (_after) {
      after.concat(_after);
    }
    test(tape, name, fn, before, after, only);
  };

  return testRunner;
}

function test (tape, name, fn, _before, _after, only, skip) {
  var before = _before || [];
  var after = _after || [];
  var tapeTest = only
    ? tape.only
    : skip ? tape.skip : tape;

  tapeTest(name, function (t) {
    var tEnd = t.end.bind(t);
    var tPlan = t.plan.bind(t);
    var executedAfters = false;

    t.end = function () {
      runWrapperFns(after, function () {
        executedAfters = true;
        tEnd();
      });
    };

    t.plan = function (numberofAssertions) {
      tPlan(numberofAssertions);
    };

    t.on('end', function (num) {
      if (!executedAfters) {
        runWrapperFns(after, function () {
          executedAfters = true;
        });
      }
    });

    t.beforeEach = function (fn) {
      before.push(fn);
    };

    t.afterEach = function (fn) {
      after.push(fn);
    };

    t.test = function (tName, tFn, only, skip) {
      var tapesTest = only
        ? test.only
        : skip ? test.skip : test;

      tapesTest(tape, name + delimiter + tName, tFn, before.slice(0), after.slice(0));
    };

    t.test.only = function (tName, tFn) {
      t.test(tName, tFn, true);
    };

    t.test.skip = function (tName, tFn) {
      t.test(tName, tFn, false, true);
    };

    runWrapperFns(before, function () {
      fn(t);
    });
  });
};

function runWrapperFns (fns, callback) {
  callback = callback || function () {};

  async.eachSeries(fns, function (fn, done) {
    fn({end: done});
  }, callback);
}

module.exports = tapes;
