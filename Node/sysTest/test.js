var request = require('supertest');
var should = require("chai").should();
var Test = require('../lib/schemaPractice');
request = request('http://localhost:3000');
var mongoose = require('mongoose');
var promises = require('../lib/promises');
mongoose.connect('mongodb://localhost/test');
var functions = require('../lib/functions')

describe("GET '/'", function(){
	it('responds with Hello World!', function(done){
		request
		.get('/')
		.expect('Hello World!')
		.end(function(err, res){
			if (err) return done(err);
			done();
		});
	});
});

describe("GET '/character/:name'", function(){
	var AlaisiagaeDbDoc = null;
	var GeraldineDbDoc = null;

	before(function(done){
		
		//mongoose.connection.db.dropDatabase(function(err) {
			//console.log(err)
			promises.saveDocument({name: 'Alaisiagae', level: 274})			
			.then(function(result){
				console.log("Alaisiagae document was successfully saved:\n\n" + result);
				Test.findOne({name: 'Alaisiagae'})
				.exec(function(err, result){
					AlaisiagaeDbDoc = result.toObject();

				promises.saveDocument({name: 'Geraldine', level: 10392})
					.then(function(result){
						console.log("Geraldine document was successfully saved:\n\n" + result);
						promises.findOneDocument(Test, {name: 'Geraldine'})
						.then(function(result){
							GeraldineDbDoc = result;
							done();
						}, function(err){
							GeraldineDbDoc = err;
							console.log(err);
							done();
						})
					});

				});
			}, function(err){
				console.log(err);
				done();
			});


		//}); 
	});

	it('returns Alaisiagae document ID', function(done){
		request
		.get('/characters/Alaisiagae')
		.end(function(err, res){
			if (err){
			return done(err);
			}
			res.body._id.should.equal(AlaisiagaeDbDoc._id.toString());
			done();
		});
	});

	it('returns Alaisiagae document level', function(done){
		request
		.get('/characters/Alaisiagae')
		.end(function(err, res){
			if (err){
			return done(err);
			}
			res.body.level.should.equal(AlaisiagaeDbDoc.level);
			done();
		});
	});

	it('returns Alaisiagae document date', function(done){
		request
		.get('/characters/Alaisiagae')
		.end(function(err, res){
			if (err){
				return done(err);
			}

			function dateAppender(date){
				var x = date;
				return ('0' + x).slice(-2);				
			};

			function millisecondAppender(date){
				var x = date;
				return ('00' + x).slice(-3);
			}

			var docDay = dateAppender(AlaisiagaeDbDoc.date.getUTCDay());
			var docDayString = docDay.toString();
			var docMonth = dateAppender(AlaisiagaeDbDoc.date.getUTCMonth() + 1);
			var docMonthString = docMonth.toString();
			var docYear = AlaisiagaeDbDoc.date.getUTCFullYear().toString();

			var docTime = dateAppender(AlaisiagaeDbDoc.date.getUTCHours()) + ':' + dateAppender(AlaisiagaeDbDoc.date.getUTCMinutes())
			 + ':' + AlaisiagaeDbDoc.date.getUTCSeconds() + '.' + millisecondAppender(AlaisiagaeDbDoc.date.getUTCMilliseconds());

			var fullDocDate = (docYear + '-' + docMonthString + '-' + docDayString + 'T' + docTime + 'Z');
			console.log(fullDocDate);
			res.body.date.should.equal(fullDocDate);
			done();
		});
	});

	it('Geraldine document will not exist', function(done){
		request
		.delete('/characters/Geraldine')
		.end(function(err, res){
			if(err){
				return done(err);
			}

			console.log(res.body);
			res.body.should.not.have.properties;
			done();
			})
		})
	})
