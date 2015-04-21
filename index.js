var async = require('async');
var extend = require('lodash.assign');

module.exports = function (tape) {
  
  // Ensure we have a TAP test runner
  if (!tape || typeof tape !== 'function') {
    throw new Error('A TAP test runner is required');
  }
  
  return function (testName, run) {
    
    tape(testName, function (t) {
      
      var beforeEachCollection = [];
      var afterEachCollection = [];
      var _tTest = t.test.bind(t);
      
      t.beforeEach = function (callback) {
        
        beforeEachCollection.push(callback);
        return t;
      };
      
      t.afterEach = function (callback) {
        
        afterEachCollection.push(callback);
        return t;
      };
      
      // Overwrite the test function so that the beforeEach and
      // afterEach can run
      t.test = function (testName, testRun) {
        
        // Create test case
        _tTest(testName, function (ctx) {
          
          var end = ctx.end.bind(ctx);
          
          // Do all the things
          async.series([
            runBeforeEach,
            runTest,
            runAfterEach
          ], end);
          
          function runBeforeEach (beforeEachDone) {
            
            async.eachSeries(beforeEachCollection, function (fn, done) {
              
              fn(extend(ctx, {
                end: done
              }));
            }, beforeEachDone);
          }
          
          function runTest (done) {
            
            ctx.end = done;
            testRun(ctx);
          }
          
          function runAfterEach (afterEachDone) {
            
            async.eachSeries(afterEachCollection, function (fn, done) {
              
            fn(extend(ctx, {
              end: done
            }));
            }, afterEachDone);
          }
        });
      }
      
      // Run the test
      run(t);
      
      // Keeps it chainable
      return t;
    });
  };
};
