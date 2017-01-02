'use strict';
var mongoose = require('mongoose');
var path = require('path');

var config = require(path.join(global.appRoot, 'configurations/config.json'));

mongoose.connect('mongodb://localhost/' + config.db.name, function(){
    console.log('mongodb connected');
});
module.exports = mongoose;
