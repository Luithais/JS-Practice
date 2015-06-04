var save = require('./save');

module.exports = function saveDocument(cha){
	save(cha)
		.then( function(result){
				console.log(result);
			}, function(err){
				console.log(err);
			}); 
}       