var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
	name: { type: String, select: false },
	level: { type: Number, required: true },
	date: { type: Date, default: Date.now}
});

var Test = mongoose.model('Test', testSchema);

module.exports = Test;



