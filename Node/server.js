var mongoose = require('mongoose');
var promises = require('./lib/promises');
var Test = require('./lib/schemaPractice');
mongoose.connect('mongodb://localhost/test');
var Q = require('q');
var express = require('express');

var app = express();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {});

var cha = {
 name: 'Alaisiagae',
 level: 296};

var dbDoc;

promises.saveDocument(cha)
	.then( function(result){
			console.log(result);
			dbDoc = result;
		}, function(err){
			console.log(err);
		});

//instanceOfExpress.HTTPMethod(pathOnServerAsString, functionToExecuteWhenPathIsMatched)
/*	req = request
	res = result 	*/
/*	directory = file system
	path = HTTP */

app.get('/', function(req, res){
	res.send('Hello World!');
})

/* The above performs the following:
	1. Requests data (get)
	2. Looks for root path
	3. Runs a function with parameters req & res
	4. Function sends result: a string containing "Hello World!" */

app.get('/document', function(req, res){
	res.send(dbDoc);
	console.log(dbDoc);
});


app.get('/characters/:name', function(req, res){
	Test.findOne({name: req.params.name}, function(err, result){
		res.send(result.toObject());
	});
});

app.delete('/characters/:name', function(req, res){
	Test.remove({ name: req.params.name },function(err){
            res.sendStatus(200);
        });
});

app.update('/characters/:name', function(req, res){

});

app.post('/new', function(req, res){
	var result = null;

	promises.saveDocument({name: 'Squire', level: 1})
	.then(function(result){
		console.log(result);
		res.send(result);
	}, function(err){
		console.log(err);
	});
})

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s', host, port);

});