var SIZE=5;
var proxy=function(a,b,next){next();}

var handle=function(){return}; //last
var a=[];for (var i=0;i<SIZE;i++) {a.push(proxy);}
a.forEach(function(layer){
	var child=handle;
	handle=function(a,b){return layer(a,b,function(){return child()});}
});
var chain=function(a,b){
    handle(a,b);
}

var array=[function(){}];//last
for (var i=0;i<SIZE;i++){array.push(proxy)};
var L=array.length-1;
var fnArray=function(a,b){
	var i=L;
	var next=function(){
		return array[--i](a,b,next);
	}
	return array[i](a,b,next);
}

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
// add tests
suite.add('Chained', function() {
  		chain(null,null);
})
.add('Array', function() {
  		fnArray(null,null);
})

// add listeners
.on('cycle', function(bench) {
  console.log(String(bench));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run(true);
