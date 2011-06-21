var zen=require('../zen-http');

this.core = {
  '0. Zen should run without handler ': function (test) {	
	//build app
	var zapp=zen();
	zapp.errorHandler=function(a,b,err){test.ok(true, 'The errorHandler was executed');};
	//run
	zapp(1,2);

	test.expect(1);
    test.done();
	
  	},
  	'1. Zen should run one handler': function (test) {	
	var hw=function(a,b,next){test.ok(true, 'The handler was executed');};
	var zapp=zen(hw);
	zapp.errorHandler=function(a,b,err){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(a,b,err){test.ok(false, 'The resultHandler was executed');};		
	zapp(1,2);

	test.expect(1);
    test.done();
	
  	},
    '2. Zen should run errorHandler on errors': function (test) {	
	var hw=function(a,b,next){test.ok(true, 'The handler was executed');next('error')};
	var zapp=zen(hw);
	zapp.errorHandler=function(a,b,err){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(a,b,res){test.ok(false, 'The resultHandler was executed');};
	zapp(1,2);

	test.expect(2);
    test.done();
	
  	},
  	'3. Zen should run resultHandler on result': function (test) {	
	var hw=function(a,b,next){test.ok(true, 'The handler was executed');next(null,'result')};
	var zapp=zen(hw);
	zapp.errorHandler=function(a,b,err){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(a,b,res){test.ok(true, 'The resultHandler was executed');};
	zapp(1,2);

	test.expect(2);
    test.done();
	
  	},	
  	'4. Zen should run errorHandler on last empty "next()"': function (test) {	
	var hw=function(a,b,next){test.ok(true, 'The handler was executed');next()};
	var zapp=zen(hw);
	zapp.errorHandler=function(a,b,err){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(a,b,res){test.ok(false, 'The resultHandler was executed');};
	zapp(1,2);

	test.expect(2);
    test.done();	
  	},	
  '5. Zen should run with parameter and without handler ': function (test) {	
	var zapp=zen();
	zapp.errorHandler=function(v1,v2, err){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof err === 'undefined', 'The handler was executed with the value `' + err + '`.');
	};		
	zapp(1,2);

	test.expect(4);
    test.done();
	
  	},
  	'6. Zen should run one handler with parameters': function (test) {	
	var hw=function(v1,v2,next){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
	};
	var zapp=zen(hw);
	zapp(1,2);

	test.expect(4);
    test.done();
	
  	},
    '7. Zen should run errorHandler on errors with parameters ': function (test) {	
	var hw=function(v1,v2,next){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
		next('error');
	};
	var zapp=zen(hw);
	zapp.errorHandler=function(v1,v2,err){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(err === 'error', 'The handler was executed with the value `' + err + '`.');
	}
	zapp.resultHandler=function(v1,v2,res){
		test.ok(false, 'The resultHandler was executed');};
	zapp(1,2);

	test.expect(8);
    test.done();
	
  	},
  	'8. Zen should run resultHandler on result with parameters ': function (test) {	
	var hw=function(v1,v2,next){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
		next(null,'result');
	};
	var zapp=zen(hw);
	zapp.errorHandler=function(v1,v2,err){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(v1,v2,res){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(res === 'result', 'The handler was executed with the value `' + res + '`.');
	};
	zapp(1,2);

	test.expect(8);
    test.done();
	
  	},	
  	'9. Zen should run errorHandler with parameters on last empty "next()"': function (test) {	
	var hw=function(v1,v2,next){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
		next();
	};
	var zapp=zen(hw);
	zapp.errorHandler=function(v1,v2,err){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof err == 'undefined' || !err, 'The handler was executed with the value `' + err + '`.');
	};
	zapp.resultHandler=function(v1,v2,res){test.ok(false, 'The resultHandler was executed');};
	zapp(1,2);

	test.expect(8);
    test.done();	
  	},	
	'10. Zen should catch single handler exception ': function (test) {
	var hw=function(a,b,next){nexto()}; /*Exception!*/
	var zapp=zen(hw);

	zapp.errorHandler=function(a,b,err){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(a,b,res){test.ok(false, 'The resultHandler was executed');};		
	test.doesNotThrow(function(){zapp(1,2);});

	test.expect(2);
    test.done();

	},
	'11. Zen should catch multi handler exception ': function (test) {
	var hw1=function(a,b,next){next()};
	var hw2=function(a,b,next){next()};
	var hw3=function(a,b,next){next()};
	var hw4=function(a,b,next){nexto()}; /*Exception!*/
	var zapp=zen(hw1,hw2,hw3,hw4);

	zapp.errorHandler=function(a,b,err){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(a,b,res){test.ok(false, 'The resultHandler was executed');};		
	test.doesNotThrow(function(){zapp(1,2);});

	test.expect(2);
    test.done();

	},
	'12. Zen should catch error handler exception ': function (test) {
	var fakeresp={
		writeHead:function(){test.ok(true,'Header wrote')},
		end:function(){test.ok(true,'Body wrote')}
	}
	var hw=function(a,b,next){next()};
	var zapp=zen(hw);

	//this runs 2 times
	zapp.errorHandler=function(a,b,err){
		test.ok(true, 'The errorHandler was executed');
		next(); /*Exception!*/
	}; 
	zapp.resultHandler=function(a,b,res){test.ok(false, 'The resultHandler was executed');};		
	test.doesNotThrow(function(){zapp({},fakeresp);});

	test.expect(5);
    test.done();

	},
	'13. Zen should catch result handler exception ': function (test) {
	var hw=function(a,b,next){next(null,'result')};
	var zapp=zen(hw);

	zapp.errorHandler=function(a,b,err){test.ok(true, 'The errorHandler was executed');	}; 
	zapp.resultHandler=function(a,b,res){
		test.ok(true, 'The resultHandler was executed');
		next(); /*Exception!*/
	};		
	test.doesNotThrow(function(){zapp(1,2);});

	test.expect(3);
    test.done();

	},
	'14. Zen should resolve paused requests on resume ': function (test) {
	var hw=function(a,b,next){next(null,'result')};
	var zapp=zen(hw);
	zapp.pause();

	zapp.errorHandler=function(a,b,err){test.ok(false, 'The errorHandler was executed');}; 
	zapp.resultHandler=function(a,b,res){test.ok(true, 'The resultHandler was executed');};		
	
	zapp(1,1);
	zapp(2,2);
	zapp(3,3);
	zapp.resume();

	test.expect(3);
    test.done();

	},
	'15. Zen should delegate to errorHandler when stopped ': function (test) {
	var hw=function(a,b,next){next(null,'result')};
	var zapp=zen(hw);

	zapp.errorHandler=function(a,b,err){test.ok(true, 'The errorHandler was executed');}; 
	zapp.resultHandler=function(a,b,res){test.ok(true, 'The resultHandler was executed');};		
	
	zapp(1,1);
	zapp.stop();
	zapp(2,2);
	zapp.resume();
	zapp(3,3);

	test.expect(3);
    test.done();

	},	
};
