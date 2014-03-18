var test = require('tape');
var async = require('async');
var extend = require('extend');
var Promise = require('promise');

module.exports = function suite (name, setupRunner, options) {
  var endNoop = function (t) {t.end();};
  var afterEach = [];
  var beforeEach = [];
  var tests = tests || [];
  var end = false;
  
  // Transfer options to nested suites
  if (options) {
    beforeEach = options.beforeEach || [endNoop];
    afterEach = options.afterEach || [endNoop];
  }
  
  test(name, function (t) {
    var suiteActions = {};
    
    suiteActions.beforeEach = function (fn) {
      beforeEach.push(fn);
    };
    
    suiteActions.afterEach = function (fn) {
      afterEach.push(fn);
    };
    
    suiteActions.test = function (name, fn, title) {
      t.test(name, function (q) {
        tests.push(new Promise(function (resolve, reject) {
          runBeforeEach(function () {
            var end = q.end;
            
            q.end = function () {
              runAfterEach(function () {
                end.call(q);
                resolve();
              });
            };
            
            fn.call(q, q);
          });
        }));
      });
    };
    
    suiteActions.suite = function (name, setupRunner) {
      suite(name, setupRunner, extend(options, {
        beforeEach: beforeEach,
        afterEach: afterEach
      }));
    };
    
    // Run it all
    setupRunner(suiteActions);    
    
    function runBeforeEach (callback) {
      async.eachSeries(beforeEach, function (before, done) {
        before({end: done});
      }, callback);
    }
    
    function runAfterEach (callback) {
      async.eachSeries(afterEach, function (after, done) {
        after({end: done});
      }, callback);
    }
    
    // All done
    Promise.all(tests).then(function () {
      t.end();
    });
  });

};


// Output json
// test.createStream({ objectMode: true }).on('data', function (row) {
//     console.log(JSON.stringify(row))
// });

// OR

// test.createStream().pipe(process.stdout);