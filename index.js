var tape = require('tape');
var async = require('async');
var cloneDeep = require('lodash.clonedeep');
var extend = require('lodash.assign');

// Putting the only here ensures this gets applied
// throughout all tests. The only time this could get
// messed up is if the require cache is cleared, then it might
// run more tests than wanted. This is an extreme edge case
// and will be dealt with if encountered
var only = false;

var runner = module.exports = function (description, fn, _internals) {
  
  // After each functions should be ran in a last in/first out series
  var shouldPrependAfterEach = false;
  if (_internals && _internals.afterEach) {
    shouldPrependAfterEach = true;
  }
  
  // Ensure we maintain internals
  var internals = extend({
    beforeEach: [],
    afterEach: []
  }, _internals);
  
  process.nextTick(run);
  
  function run () {
    
    // Only set up tests if there's a test callback
    if (fn) {
      
      // Because of the nature of the only() method in tape (it can only have one),
      // we ensure that any test that is set to only or has a parent set to only,
      // is set up to run.
      if (only && (internals.only || internals.parentOnly)) {
        tape(description, testCallback);
      }
      
      // Skip the module
      else if(internals.skip) {
        tape.skip(description, testCallback); 
      }
      
      // Only set up a test if this no module is set with only()
      else if (!only) {
        tape(description, testCallback);
      }
    }
    
    // When the test is complete, make sure tape
    // gets closed
    function testCallback (tRoot) {
              
      var rootEnd = tRoot.end;
      tRoot.end = function () {
        
       rootEnd.apply(rootEnd, arguments);
      };
      
      fn(tRoot, {});
    }
  }
  
  // Wrap the test with befores/afters and anything else
  // the test wants
  function test (testDescription, fn, options) {
    
    options = options || {};
    
    var _fn = fn;
    
    // Wrap tests in before/after (each)
    if (fn && typeof fn === 'function') {
      fn = function (t, context) {
        
        var end = t.end.bind(t);
        
        async.series({
          beforeEach: function (done) {
            
            async.eachSeries(internals.beforeEach, function (before, beforeDone) {
              
              before({end: beforeDone}, context);
            }, done);
          },
          test: function (done) {
            
            t.end = done;
            // _fn(t, context);
            _fn(t, context);
          },
          afterEach: function (done) {
            
            async.eachSeries(internals.afterEach, function (after, afterDone) {
              
              after({end: afterDone}, context);
            }, done);
          }
        }, function () {
          
          end();
        });
      }
    }
    
    // Pass in internals so that we can have nested before/after (each) type
    // functions to nested tests.
    // Need to track if parent has an only() method called. If it is called, then
    // we don't need to to set the kids as only()
    var childOptions = cloneDeep(options);
    var parentInternals = cloneDeep(internals);
    
    if (parentInternals.only) {
      childOptions.only = false;
      childOptions.parentOnly = true;
    }
    
    var nextInternals = extend(parentInternals, childOptions);
    
    // Return a runner with a namespace description prepended
    return runner(description + ' - ' + testDescription, fn, nextInternals);
  }
  
  test.only = function (testDescription, fn) {
    
    only = true;
    
    return test(testDescription, fn, {
      only: true
    });
  };
  
  test.skip = function (testDescription, fn) {
    
    return test(testDescription, fn, {
      skip: true
    });
  };
  
  function beforeEach (fn) {
    
    // TODO: fail fast here if no "fn"
    
    if (fn) {
      internals.beforeEach.push(fn);
    }
    
    return methods;
  }
  
  function afterEach (fn) {
    
    if (fn) {
      // See the definition of shouldPrependAfterEach for why this is done
      internals.afterEach[shouldPrependAfterEach ? 'unshift' : 'push'](fn);
    }
    
    return methods;
  }
  
  /////////////////
  
  var methods = {
    beforeEach: beforeEach,
    afterEach: afterEach,
    test: test
  };
  
  return Object.freeze(methods);
};

runner.only = function (description, fn, _internals) {
  
  return runner(description, fn, {
    only: true
  });
};

runner.skip = function (description, fn, _internals) {
  
  return runner(description, fn, {
    skip: true
  });
};