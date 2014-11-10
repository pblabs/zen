process.env.NODE_ENV = "test";

var zen=require('../zen');

this.core = {
  '0. Zen should run without handler ': function (test) {	
	//build app
	var zapp=zen();
	zapp.errorHandler=function(){test.ok(true, 'The errorHandler was executed');};
	//run
	zapp();

	test.expect(1);
    test.done();
	
  	},
  	'1. Zen should run one handler': function (test) {	
	var hw=function(){test.ok(true, 'The handler was executed');};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};		
	zapp();

	test.expect(1);
    test.done();
	
  	},
    '2. Zen should run errorHandler on errors': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next('error')};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();
	
  	},
  	'3. Zen should run resultHandler on result': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next(null,'result')};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(true, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();
	
  	},	
  	'4. Zen should run errorHandler on last empty "next()"': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next()};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();	
  	},	
  '5. Zen should run with parameter and without handler ': function (test) {	
	var zapp=zen();
	zapp.errorHandler=function(value1, err){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof err === 'undefined', 'The handler was executed with the value `' + err + '`.');
	};		
	zapp(1);

	test.expect(3);
    test.done();
	
  	},
  	'6. Zen should run one handler with parameters': function (test) {	
	var hw=function(value1,next){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
	};
	var zapp=zen(hw);
	zapp(1);

	test.expect(3);
    test.done();
	
  	},
    '7. Zen should run errorHandler on errors with parameters ': function (test) {	
	var hw=function(value1,next){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
		next('error');
	};
	var zapp=zen(hw);
	zapp.errorHandler=function(value1,err){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(err === 'error', 'The handler was executed with the value `' + err + '`.');
	}
	zapp.resultHandler=function(value1,res){
		test.ok(false, 'The resultHandler was executed');};
	zapp(1);

	test.expect(6);
    test.done();
	
  	},
  	'8. Zen should run resultHandler on result with parameters ': function (test) {	
	var hw=function(value1,next){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
		next(null,'result');
	};
	var zapp=zen(hw);
	zapp.errorHandler=function(value1,err){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(value1,res){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(res === 'result', 'The handler was executed with the value `' + res + '`.');
	};
	zapp(1);

	test.expect(6);
    test.done();
	
  	},	
  	'9. Zen should run errorHandler with parameters on last empty "next()"': function (test) {	
	var hw=function(value1,next){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
		next();
	};
	var zapp=zen(hw);
	zapp.errorHandler=function(value1,err){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof err == 'undefined' || !err, 'The handler was executed with the value `' + err + '`.');
	};
	zapp.resultHandler=function(value1,res){test.ok(false, 'The resultHandler was executed');};
	zapp(1);

	test.expect(6);
    test.done();	
  	},	
  	'10. Zen should run two handler with 1 parameter': function (test) {	
	var hw1=function(value1,next){test.ok(true, 'The handler was executed'); next();};	
	var hw2=function(value1,next){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
	};
	var zapp=zen(hw1,hw2);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};		
	zapp(1);

	test.expect(4);
    test.done();
	
  	},
  	'11. Zen should run two handler with 2 parameters': function (test) {	
	var hw1=function(value1,value2,next){test.ok(true, 'The handler was executed'); next();};	
	var hw2=function(value1,value2,next){
		test.ok(arguments.length===3, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof value2 !== 'undefined', 'The handler was executed with the value `' + value2 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
	};
	var zapp=zen(hw1,hw2);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};		
	zapp(1,2);

	test.expect(5);
    test.done();
	
  	},
  	'13. Zen should run two handler with 3 parameters': function (test) {	
	var hw1=function(v1,v2,v3,next){test.ok(true, 'The handler was executed'); next();};	
	var hw2=function(v1,v2,v3,next){
		test.ok(arguments.length===4, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof v3 !== 'undefined', 'The handler was executed with the value `' + v3 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
	};
	var zapp=zen(hw1,hw2);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};		
	zapp(1,2,3);

	test.expect(6);
    test.done();
	
  	},
  	'14. Zen should run two handler with 4 parameters': function (test) {	
	var hw1=function(v1,v2,v3,v4,next){test.ok(true, 'The handler was executed'); next();};	
	var hw2=function(v1,v2,v3,v4,next){
		test.ok(arguments.length===5, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof v3 !== 'undefined', 'The handler was executed with the value `' + v3 + '`.');
		test.ok(typeof v4 !== 'undefined', 'The handler was executed with the value `' + v4 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
	};
	var zapp=zen(hw1,hw2);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};		
	zapp(1,2,3,4);

	test.expect(7);
    test.done();
	},
  	'15. Zen should run two handler with 5 parameters': function (test) {	
	var hw1=function(v1,v2,v3,v4,v5,next){test.ok(true, 'The handler was executed'); next();};	
	var hw2=function(v1,v2,v3,v4,v5,next){
		test.ok(arguments.length===6, 'The handler was executed with the correct number of arguments');
		test.ok(typeof v1 !== 'undefined', 'The handler was executed with the value `' + v1 + '`.');
		test.ok(typeof v2 !== 'undefined', 'The handler was executed with the value `' + v2 + '`.');
		test.ok(typeof v3 !== 'undefined', 'The handler was executed with the value `' + v3 + '`.');
		test.ok(typeof v4 !== 'undefined', 'The handler was executed with the value `' + v4 + '`.');
		test.ok(typeof v5 !== 'undefined', 'The handler was executed with the value `' + v5 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
	};
	var zapp=zen(hw1,hw2);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};		
	zapp(1,2,3,4,5);

	test.expect(8);
    test.done();
	},
	'16. Zen should catch single handler exception ': function (test) {
	var hw=function(next){nexto()}; /*Exception!*/
	var zapp=zen(hw);

	zapp.errorHandler=function(err){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(res){test.ok(false, 'The resultHandler was executed');};		
	test.doesNotThrow(function(){zapp();});

	test.expect(2);
    test.done();

	},
	'17. Zen should catch multi handler exception ': function (test) {
	var hw1=function(next){next()};
	var hw2=function(next){next()};
	var hw3=function(next){next()};
	var hw4=function(next){nexto()}; /*Exception!*/
	var zapp=zen(hw1,hw2,hw3,hw4);

	zapp.errorHandler=function(err){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(res){test.ok(false, 'The resultHandler was executed');};		
	test.doesNotThrow(function(){zapp();});

	test.expect(2);
    test.done();

	},
	'18. Zen should catch error handler exception ': function (test) {
	var hw=function(next){next()};
	var zapp=zen(hw);

	zapp.errorHandler=function(err){
		test.ok(true, 'The errorHandler was executed');
		next(); /*Exception!*/
	}; 
	zapp.resultHandler=function(res){test.ok(false, 'The resultHandler was executed');};		
	test.doesNotThrow(function(){zapp();});

	test.expect(2);
    test.done();

	},
	'19. Zen should catch result handler exception ': function (test) {
	var hw=function(next){next(null,'result')};
	var zapp=zen(hw);

	zapp.errorHandler=function(err){test.ok(true, 'The errorHandler was executed');	}; 
	zapp.resultHandler=function(res){
		test.ok(true, 'The resultHandler was executed');
		next(); /*Exception!*/
	};		
	test.doesNotThrow(function(){zapp();});

	test.expect(3);
    test.done();

	},
	'20. Zen should resolve paused requests on resume ': function (test) {
	var hw=function(a,next){next(null,'result')};
	var zapp=zen(hw);
	zapp.pause();

	zapp.errorHandler=function(a,err){test.ok(false, 'The errorHandler was executed');}; 
	zapp.resultHandler=function(a,res){test.ok(true, 'The resultHandler was executed');};		
	
	zapp(1);
	zapp(2);
	zapp(3);
	zapp.resume();	

	test.expect(3);
    test.done();

	},
	'21. Zen should delegate to errorHandler when stopped ': function (test) {
	var hw=function(a,next){next(null,'result')};
	var zapp=zen(hw);

	zapp.errorHandler=function(err){test.ok(true, 'The errorHandler was executed');}; 
	zapp.resultHandler=function(res){test.ok(true, 'The resultHandler was executed');};		
	
	zapp(1);
	zapp.stop();
	zapp(2);
	zapp.resume();
	zapp(3);	

	test.expect(3);
    test.done();

	},
};
