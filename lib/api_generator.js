// GET, POST, PUT, DELETE
// Get by id { /modelname/:id}
// Post or Put is diffrentiated by id {/modelname/new} {/modelname/:id/update}
// Delete by {/modelname/:id/delete}
'use strict';
var BPromise = require('bluebird');
var _ = require('underscore');
var express = require('express');
var routes = {};
var Methods = require('./methods_generator');

var Response = require('./response');


function InitApi(allModels) {
	if(!InitApi.initiated) {
		InitApi.initiated = true;
		var allMethods = new Methods(allModels);
		var modelNames = _.keys(allMethods);
		modelNames.forEach(function(modelName) {
			var router = express.Router();
			this.generateApi(router, modelName);
			routes[modelName] = router;
		}.bind(this));
	}
	return routes;
}



InitApi.prototype.generateApi = function(router, modelName) {
	router.get('/', function (req, res, next) {
		let query = req.query.query;
		global.methods[modelName].getByQuery(query)
		.then(function(data) {
			res.json(new Response(1, data));
		})
		.catch(function(err) {
			// res.json(new Response(0, err));
			return next(err);
		});
	});

	router.get('/:id', function (req, res, next) {
		let id = req.params.id || req.query.id;
		global.methods[modelName].getById(id)
		.then(function(data) {
			res.json(new Response(1, data));
		})
		.catch(function(err) {
			return next(err);
			// res.json(new Response(0, err));
		});
	});

	router.post('/new', function (req, res, next) {
		let doc = req.body;
		if(doc.id) {
			delete doc.id;
		}
		global.methods[modelName].save(doc)
		.then(function(data) {
			res.json(new Response(1, data));
		})
		.catch(function(err) {
			// res.json(new Response(0, err));
			return next(err);
		});
	});
	router.post('/:id', function (req, res, next) {
		let id = req.body.id || req.params.id;
		let doc = req.body;
		if(id) {
			doc.id = id;
		}
		global.methods[modelName].save(doc)
		.then(function(data) {
			res.json(new Response(1, data));
		})
		.catch(function(err) {
			return next(err);
			// res.json(new Response(0, err));
		});
	});
	router.put('/:id', function (req, res, next) {
		let id = req.body.id || req.params.id;
		let doc = req.body;
		if(id) {
			doc.id = id;
		}
		global.methods[modelName].save(doc)
		.then(function(data) {
			res.json(new Response(1, data));
		})
		.catch(function(err) {
			return next(err);
			// res.json(new Response(0, err));
		});
	});
	router.delete('/:id', function (req, res, next) {
		let id = req.body.id || req.params.id || req.query.id;
		if(!id) {
			return res.json(new Response(0, new Error('Nothing to delete')));
		}
		global.methods[modelName].delete(id)
		.then(function(data) {
			res.json(new Response(1, data));
		})
		.catch(function(err) {
			return next(err);
			// res.json(new Response(0, err));
		});
	});
};

module.exports = InitApi;