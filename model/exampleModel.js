var db = require('../lib/db.js');
var Schema = db.Schema;
var exampleSchema = new Schema({
	example1: {
		type: String,
		required: true
	}
});

var example = db.model('example', exampleSchema, 'example');

module.exports = example;