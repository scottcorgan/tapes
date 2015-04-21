var async = require('async');
var extend = require('lodash.assign');
var omit = require('lodash.omit');

module.exports = function (tape) {
  
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
      
      t.test = function (testName, testRun) {
        
        _tTest(testName, function (ctx) {
          
          var end = ctx.end.bind(ctx);
          
          async.series({
            beforeEach: function (done) {
              
              async.eachSeries(beforeEachCollection, function (fn, done) {
                
                var beforeCtx = extend(ctx, {
                  end: function () {
                    
                    // Ensure we pass context from beforeEach to 
                    // test runner
                    ctx = extend(ctx, omit(beforeCtx, 'end'));
                    done();
                  }
                });
                
                fn(beforeCtx);
              }, done);
            },
            runner: function (done) {
              
              ctx.end = done;
              testRun(ctx);
            },
            afterEach: function (done) {
              
              async.eachSeries(afterEachCollection, function (fn, done) {
                
                var afterCtx = extend(ctx, {
                 end: function () {
                   
                   // Ensure we pass context from afterEach to 
                   // test runner
                   ctx = extend(ctx, omit(afterCtx, 'end'));
                   done();
                 }
               });
               
               fn(afterCtx);
              }, done);
            }
          }, function (err, results) {
            
            end(err);
          });
        });
      };
      
      // TODO: implement test.only()
      
      extend(t.test, _tTest);
      run(t);
      
      return t;
    });
  };
};