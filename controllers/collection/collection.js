'use strict';
var jsonfile = require('jsonfile');
jsonfile.spaces = 4;
var fs = require('fs');
var path = require('path');
var authLocation = path.join(global.appRoot, 'configurations/auth.json');

// TODO: add more as required here
const config = require(path.join(global.appRoot, 'configurations/config.json'));
const filesName = config.hooks;
const modelFolder = config.modelFolder;
var collection = {
	loadCollections: function(req, res, next) {
		var dir = path.join(global.appRoot, modelFolder);
		fs.readdir(dir, function (err, files){
			if(err) {
				return next(err);
			}
			return res.json({
				success: 1,
				data: files
			});
		});
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
	},
	useOauth: function(req, res, next) {
		var file = require(authLocation);
		switch(req.body.authType.toLowerCase()){
			case 'google':
				file.googleAuth = {
					'clientID'      : req.body.id,
					'clientSecret'  : req.body.secret,
					'callbackURL'   : 'http://localhost:3000/users/auth/google/callback'
				};
				break;
			case 'facebook':
				file.facebookAuth = {
					'clientID' 		: req.body.id,
					'clientSecret'	: req.body.secret,
					'callbackURL'	: 'http://localhost:3000/users/auth/facebook/callback'
				};
				break;
			case 'twitter':
				file.twitterAuth = {
					'consumerKey'	: req.body.id,
					'consumerSecret': req.body.secret,
					'callbackURL'	: 'http://localhost:3000/users/auth/twitter/callback'
				};
				break;
		}
		jsonfile.writeFile(authLocation, file, function(err) {
			if(err) {
				return next(err);
			}
			return res.json({
				success: 1
			});
		});
	},
	useInBuiltUser: function(req, res, next) {
		var file = require(authLocation);
		file.defaultUser = JSON.parse(req.body.defaultUser);
		jsonfile.writeFile(authLocation, file, function(err) {
			if(err) {
				return next(err);
			}
			return res.json({
				success: 1
			});
		});
	}
};

module.exports = collection;