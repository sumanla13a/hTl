'use strict';
var _ = require('underscore');
var fs = require('fs');

var path = require('path');

const config = require(path.join(global.appRoot, 'configurations/config.json'));
const modelFolder = config.modelFolder;
var modelJsonFolder = path.join(global.appRoot, modelFolder);


var BPromise = require('bluebird');

var db = require('./db.js');
db.set('debug', true);

var Schema = db.Schema;

const hookFiles = require(path.join(global.appRoot, 'configurations/config.json')).hooks;

var collections = {};

function createPostInitHook(modelSchema) {
	modelSchema.post('init', function(doc, next){
		this._orignal = this.toObject();
		var promises = [];
		_.keys(modelSchema.obj).forEach(function(key) {
			if(modelSchema.obj[key] && modelSchema.obj[key].hasOwnProperty('ref')) {
				promises.push(new BPromise(function(resolve, reject) {
					global.models[modelSchema.obj[key].ref].find({_id: this[key]}).exec(function(err, result) {
						if(err) {
							return reject (err);
						}
						if(result[0]) {
							this._orignal[modelSchema.obj[key].ref] = result[0];
						}
						resolve(result[0]);
					}.bind(this));
				}.bind(this)));
			}
		}.bind(this));

		BPromise.all(promises).then(function() {
			next();
		}.bind(this)).catch(function(err) {
			console.log(err);
			next();
		});
	});
}

function RegistryModel() {
	if(_.isEmpty(collections) && !RegistryModel.initialized) {
		RegistryModel.initialized = true;
		return this.createModels().then(function(){
			return BPromise.resolve(collections);
		});
	} else {
		return BPromise.resolve(collections);
	}
}


RegistryModel.prototype.createModels = function() {
	return this.getFiles().then(function(files) {
		var models = [];
		files.forEach(function(file) {
			models.push(this.registerModels(file));
		}.bind(this));
		return BPromise.all(files);
	}.bind(this));
};

RegistryModel.prototype.getFiles = function() {
	return new BPromise(function (resolve, reject) {
		fs.readdir(modelJsonFolder, function (err, files){
			if(err) {
				reject(err);
			}
			resolve(files);
		});
	});	
};

RegistryModel.prototype.registerModels = function(fileName) {
	let file = path.join(modelJsonFolder, fileName, fileName + '.json');
	let fileSchema = require(file);
	return new BPromise(function(resolve){
		let modelSchema = new Schema(fileSchema);
		hookFiles.forEach(function(hookFile) {
			let hookFunction = require(path.join(modelJsonFolder, fileName + '/' + hookFile));
			if(typeof hookFunction !== 'function') {
				console.log(fileName + ' ' + hookFile + ' does not export a function');
				// return reject(new Error(fileName + ' ' + hookFile + ' does not export a function'));
			} else {
				let loweredHookFile = hookFile.toLowerCase().split('_');
				let time = loweredHookFile[0] === 'after' ? 'post': 'pre';
				let action = loweredHookFile[1].split('.')[0];
				modelSchema[time](action, hookFunction);
			}
			
		});
		createPostInitHook(modelSchema);
		collections[fileName] = db.model(fileName, modelSchema, fileName);
		resolve({
			model: collections[fileName],
			name: fileName
		});
	});
};

module.exports = RegistryModel;