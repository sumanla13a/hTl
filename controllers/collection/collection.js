'use strict';
var jsonfile = require('jsonfile');
jsonfile.spaces = 4;
var fs = require('fs');
var path = require('path');

// TODO: add more as required here
const config = require(path.join(global.appRoot, 'configurations/config.json'));
const filesName = config.hooks;
const modelFolder = config.modelFolder;
var collection = {
	loadCollections: function(req, res) {
		res.send('respond with a resource');
	},
	getCollectionData: function(req, res, next) {
		if(!req.body.name || !req.body.schema){
			return next(new Error('SumTingWong'));
		}
		req.schema = {
			schema: req.body.schema,
			name:   req.body.name 
		};
		return next();
	},
	createCollections: function(req, res, next) {
		var dir = path.join(global.appRoot, modelFolder + '/' + req.schema.name + '/');
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		} 
		var name = path.join(dir + req.schema.name + '.json');
		jsonfile.writeFile(name, req.schema.schema, function(err) {
			if(err) {
				console.log(err);
				return next(err);
			}
			filesName.forEach(function(fName) {
				fs.openSync(path.join(dir,fName), 'a');
			});
			return res.json({
				success: 1
			});
		});
	}
};

module.exports = collection;