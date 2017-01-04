'use strict';
var BPromise = require('bluebird');
var _ = require('underscore');
var apis = {};

function InitMethods(allModels) {
	if(_.isEmpty(apis)) {
		var modelKeys = _.keys(allModels);
		modelKeys.forEach(function(key) {
			apis[key] = {};
			this.generateMethods(key, allModels[key]);
		}.bind(this));

	}
	global.methods = apis;
	return apis;
}

InitMethods.prototype.generateMethods = function (key, KeyModel) {

	apis[key].getById = function(id) {
		return new BPromise(function(resolve, reject) {
			KeyModel.findOne({id: id}, function(err, response) {
				if(err) {
					return reject(err);
				}
				return resolve(response);
			});
		});
	};

	apis[key].getByQuery = function(query) {
		return new BPromise(function(resolve, reject) {
			KeyModel.find(query, function(err, rest) {
				if(err) {
					return reject(err);
				}
				return resolve(rest);
			});
		});
	};

	apis[key].save = function(modelData) {
		return new BPromise(function(resolve, reject) {
			modelData = new KeyModel(modelData);
			modelData.validate(function(err) {
				if(err) {
					return reject(err);
				} else {
					modelData.save(function(err, result) {
						if(err) {
							return reject(err);
						}
						return resolve(result);
					});
				}
			});
		});
	};

	apis[key].delete = function(id) {
		return new BPromise(function(resolve, reject) {

			KeyModel.remove({id: id}, function(err) {
				if(err) {
					return reject(err);
				} else {
					resolve(true);
				}
			});
		});
	};
};

module.exports = InitMethods;