var STACKSIZE=0;

var zen=require('../zen');
var zhtp=require('../zen-http');
var stack=require('stack');
var stack2=require('stack2');


var zenApp;
var zhtpApp;
var stackApp;
var stack2App;

function setup(){
var mod=function(a,b,next){next();}
var middles=[];
for (var i=0;i<STACKSIZE;i++){
	middles.push(mod);
}

var errorHandler=function(a,b,err){
	return;
}

zenApp=zen.apply(this,middles);
//zenApp.on('error',errorHandler);
zenApp.errorHandler=errorHandler;

zhtpApp=zhtp.apply(this,middles);
/*zhtpApp.unsubscribeAll('error');
zhtpApp.subscribe('error',errorHandler);*/
zhtpApp.errorHandler=errorHandler;

stack.errorHandler=errorHandler;
stackApp=stack.apply(this,middles);

stack2.errorHandler=errorHandler;
stack2App=stack2.apply(this,middles);
}

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

// add tests
suite.add('Zen', function() {
  zenApp(null,null);
})
.add('Zen-http', function() {
  zhtpApp(null,null);
})
.add('Stack', function() {
  stackApp(null,null);
})
.add('Stack2', function() {
  stack2App(null,null);
})
// add listeners
.on('cycle', function(bench) {
  console.log(String(bench));
})
//.on('complete', function() {
//  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
//})
for (var i=0;i<25;i++) {
STACKSIZE=i;
setup();
console.log("Running with ",STACKSIZE,"modules")
//run async
suite.run(false);
}

[50,100,150,200].forEach(function(val){
STACKSIZE=val;
setup();
console.log("Running with ",STACKSIZE,"modules")
//run async
suite.run(false);
});
