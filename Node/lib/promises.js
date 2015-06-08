var Test = require('../lib/schemaPractice');
var Q = require('q');

module.exports.saveDocument = function (cha){
	return Q.Promise(function(resolve, reject) {
		var test = new Test(cha);
		test.save(function (err, result){
  			if (err){  	 
  	 			reject(err);
  			} else {
  	 			resolve(result);
  			}
		});
	});
};

module.exports.findOneDocument = function(database, document){
	return Q.Promise(function(resolve, reject) {
		database.findOne(document, function(err, result){
			if (err){
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

