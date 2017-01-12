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
	getAllRoutes: function(req) {
		var baseUrl = '/api/' + req.params.name;
		var app = require(path.join(global.appRoot , 'app.js'));
		var routes = app._router.stack.filter(function(r){
			return !r.regexp.fast_slash && (r.regexp.test(baseUrl) || r.regexp.test(req.query.name));
		});
		var listApi = [];
		routes[0].handle.stack.forEach(function(route) {
			var path = baseUrl + route.route.path;
			for(var k in route.route.methods) {
				listApi.push({
					method: k,
					path: path
				});
			}
		});
		return listApi;
	},
	loadCollections: function(req, res, next) {
		var dir = path.join(global.appRoot, modelFolder);
		fs.readdir(dir, function (err, files){
			if(err) {
				return next(err);
			}
			var data = {
				files: files,
				dataTypes: config.mongooseDataTypes
			};
			return res.json({
				success: 1,
				data: data
			});
		});
	},
	loadCollectionByName: function(req, res) {
		var name = req.params.name;
		var json = fs.readFileSync(path.join(global.appRoot, modelFolder + '/' + name + '/' + name + '.json'));
		var list = collection.getAllRoutes(req);
		try {
			json = JSON.parse(json);
		} catch(e) {
			return res.json({
				success: 0,
				err: e.message
			});
		}
		return res.json({
			success: 1,
			data: {
				json: json,
				listOPath: list
			}
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
				success: 1,
				data: req.schema
			});
		});
	},
	useOauth: function(req, res, next) {
		var file = require(authLocation);
		var callbackBaseURL = config.baseUrl || 'http://localhost:' + config.port;
		switch(req.body.authType.toLowerCase()){
			case 'google':
				file.googleAuth = {
					'clientID'      : req.body.id,
					'clientSecret'  : req.body.secret,
					'callbackURL'   : callbackBaseURL + '/users/auth/google/callback'
				};
				break;
			case 'facebook':
				file.facebookAuth = {
					'clientID' 		: req.body.id,
					'clientSecret'	: req.body.secret,
					'callbackURL'	: callbackBaseURL + '/users/auth/facebook/callback'
				};
				break;
			case 'twitter':
				file.twitterAuth = {
					'consumerKey'	: req.body.id,
					'consumerSecret': req.body.secret,
					'callbackURL'	: callbackBaseURL + '/users/auth/twitter/callback'
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