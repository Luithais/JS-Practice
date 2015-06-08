var mongoose = require('mongoose');
var promises = require('./lib/promises');
var Test = require('./lib/schemaPractice');
var Q = require('q');
var express = require('express');
var bodyParser = require('body-parser');
var json = require('express-json');

mongoose.connect('mongodb://localhost/test');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

app.param('character', function(req, res, next, character){
	Test.findOne({name: character}, function(err, result){
		if (err){
			res.sendStatus(404);
		}

		req.character = result;
		next();
	});
});

app.get('/character/:name', function(req, res){
	Test.findOne({name: req.params.name}, function(err, result){
		res.send(result);
	});
});

app.delete('/character/:name', function(req, res){
	Test.remove({name: req.params.name}, function(err, result){
		if (err){
			res.sendStatus(404);
		}

		res.sendStatus(200);
        });
});

app.put('/:character/:update', function(req, res){
	Test.update(req.character.name, { name: req.params.update }, function (err){
		res.sendStatus(200);
	});
});

app.post('/newCharacter', function(req, res){
	console.log(req.body.name);
	console.log(req.body.level);

	promises.saveDocument({name: req.body.name, level: req.body.level})
	.then(function (result){
		res.sendStatus(201);
	}, function (err){
		res.send(err);
	});
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s', host, port);

});