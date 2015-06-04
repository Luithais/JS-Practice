var should = require("chai").should();
var promises = require('../lib/promises');
var Test = require('../lib/schemaPractice');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

//TESTS BEGIN

describe("Model", function() {
	after(function(){ 
		mongoose.connection.db.dropDatabase(function(err, result) {});  
	});

	describe("with undefined level", function(){
		var result = null;

		before(function(done){
			var cha = {
	 		name: 'Elmo',
	 		level: undefined};

			promises.saveDocument(cha)
			.then(function(err){
				console.log(err);
				done(err);
			}, function(err){
				console.log(err);
				result = err;
				done();		
			});	
		});

		it("should error", function(){
			result.message.should.equal("Test validation failed");			
		});
	});

	describe("with defined level", function(){
	var res = null;

		before(function(done){
			var cha = {
				name: "Luthais",
				level: 1754,
			};

			promises.saveDocument(cha)
			.then(function(result){
				res = result;
				console.log(result);
				done();
			}, function(err){
				console.log(err);
				done();
			});
		});

		it("does not return name", function(done){
			Test.find({}, function (err, result) {
				var ob = result[0].toObject();
				console.log(ob);
				ob.should.not.have.property('name')
				done();
			});
		});

		it("returns current date", function(done){
			res.date.getDate().should.equal(new Date().getDate());
			done();
		});

		it("object is successfully stored in database", function(done){
			Test.findOne({name: "Luthais", level: 1754}, function(err, result){					
				should.exist(result);
				done();
			});			
		});	

	});


}); 



