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
		return KeyModel.findOne({id: id});
	};

	apis[key].getByQuery = function(query) {
		var limit, sort, fields, skip;
		if(query) {
			limit = query.limit;
			sort = query.sort;
			fields = query.field;
			skip = query.skip;
			delete query.limit;
			delete query.skip;
			delete query.field;
			delete query.sort;
		}
		return KeyModel.find(query).skip(skip).limit(limit).sort(sort).select(fields);
	};

	apis[key].save = function(modelData) {
		modelData = new KeyModel(modelData);
		return modelData.validate().then(function() {
			return modelData.save();
		}).catch(function(err) {
			return BPromise.reject(err);
		});
	};

	apis[key].delete = function(id) {
		return KeyModel.remove({id: id});
	};
};

module.exports = InitMethods;