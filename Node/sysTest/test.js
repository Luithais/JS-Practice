var request = require('supertest');
var should = require("chai").should();
var Test = require('../lib/schemaPractice');
request = request('http://localhost:3000');
var mongoose = require('mongoose');
var promises = require('../lib/promises');
mongoose.connect('mongodb://localhost/test');
var functions = require('../lib/functions');


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

describe("PUT '/Schiavona'", function(){
	var SchiavonaDbDoc = null;

	beforeEach(function(done){
		promises.saveDocument({name: 'Schiavona', level: 8888})
		.then(function(result){
			console.log("Schiavona document was successfully saved.\n\n");
			promises.findOneDocument(Test, {name: 'Schiavona'})
			.then(function(result){
				SchiavonaDbDoc = result;
				done();
			}, function(err){
				SchiavonaDbDoc = err;
				console.log(err);
				done();
			});
		});
	});

	afterEach(function(done){
		mongoose.connection.db.dropDatabase(function(err) {
			console.log(err)
			done();
		});
	});

	it("Schiavona document's name will change to 'UpdatedName'", function(done){
		request
		.put('/Schiavona/UpdatedName')
		.end(function(err, res){
			if(err){
				return done(err);
			}

			var query = Test.where({name: 'UpdatedName'});
			query.select('+name');
			query.findOne(function (err, document){
				if (err){
					return done(err);
				}

				if(document){
					console.log(document);
					document.name.should.equal('UpdatedName')
					done();
				}
			});
		});			
	});
});

describe("DELETE '/character/Geraldine'", function(){
	var GeraldineDbDoc = null;

	beforeEach(function(done){	
			promises.saveDocument({name: 'Geraldine', level: 10392})
				.then(function(result){
					console.log("Geraldine document was successfully saved.\n\n");
					promises.findOneDocument(Test, {name: 'Geraldine'})
					.then(function(result){
						GeraldineDbDoc = result;
						done();
					}, function(err){
						GeraldineDbDoc = err;
						console.log(err);
						done();
					});
				});
	});

	afterEach(function(done){
		mongoose.connection.db.dropDatabase(function(err) {
			console.log(err)
			done();
		});
	});

	it('Geraldine document will not exist', function(done){
		request
		.delete('/character/Geraldine')
		.end(function(err, res){
			if(err){
				return done(err);
			}

			res.body.should.not.have.properties;
			done();
			});
	});
});

describe("GET '/character/Alaisiagae'", function(){
	var AlaisiagaeDbDoc = null;

	beforeEach(function(done){
			promises.saveDocument({name: 'Alaisiagae', level: 274})			
			.then(function(result){
				console.log("Alaisiagae document was successfully saved.\n\n");
				Test.findOne({name: 'Alaisiagae'}) 
				.exec(function(err, result){
					AlaisiagaeDbDoc = result.toObject();
					console.log(AlaisiagaeDbDoc);
					done();
				});
			}, function(err){
				console.log(err);
				done();
			});
	});

	afterEach(function(done){
		mongoose.connection.db.dropDatabase(function(err) {
			console.log(err)
			done();
		});
	});

	it('returns Alaisiagae document ID', function(done){
		request
		.get('/character/Alaisiagae')
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
		.get('/character/Alaisiagae')
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
		.get('/character/Alaisiagae')
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

			var docDay = dateAppender(AlaisiagaeDbDoc.date.getUTCDate());
			var docDayString = docDay.toString();
			var docMonth = dateAppender(AlaisiagaeDbDoc.date.getUTCMonth() + 1);
			var docMonthString = docMonth.toString();
			var docYear = AlaisiagaeDbDoc.date.getUTCFullYear().toString();

			var docTime = dateAppender(AlaisiagaeDbDoc.date.getUTCHours()) + ':' + dateAppender(AlaisiagaeDbDoc.date.getUTCMinutes())
			 + ':' + dateAppender(AlaisiagaeDbDoc.date.getUTCSeconds()) + '.' + millisecondAppender(AlaisiagaeDbDoc.date.getUTCMilliseconds());

			var fullDocDate = (docYear + '-' + docMonthString + '-' + docDayString + 'T' + docTime + 'Z');
			console.log(fullDocDate);
			res.body.date.should.equal(fullDocDate);
			done();
		});
	});
});

describe("POST '/newCharacter'", function(){

	afterEach(function(done){
		mongoose.connection.db.dropDatabase(function(err) {
			console.log(err)
			done();
		});
	});

	it('saves a new document with name property "NewTestCharacter"', function(done){
		request
		.post('/newCharacter')
		.send({name: 'NewTestCharacter', level: 1001})
		.end(function(err, res){
			if (err){
				return done(err)
			}

			var query = Test.where({name: 'NewTestCharacter'});
			query.select('+name');
			query.findOne(function (err, document){
				if (err){
					return done(err);
				}

				else if(document){
					console.log(document);
					document.name.should.equal('NewTestCharacter')
					done();
				}
			});
		});
	});
});



