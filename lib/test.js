'use strict';
var Example = require('../model/userModel.js');

var example1 = new Example({'email': 'suman', 'password': 'suman'});

example1.save(function() {
	console.log(arguments);
});
