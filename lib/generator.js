'use strict';
var fs = require('fs');

var path = require('path');

const config = require(path.join(global.appRoot, 'configurations/config.json'));
const modelFolder = config.modelFolder;
var modelJsonFolder = path.join(global.appRoot, modelFolder);


var BPromise = require('bluebird');

var db = require('./db.js');
var Schema = db.Schema;

const hookFiles = require(path.join(global.appRoot, 'configurations/config.json')).hooks;

function RegistryModel() {
	// TODO: Do something here
}

RegistryModel.prototype.createModels = function() {
	// NOTE: implementor must catch error
	return this.getFiles().then(function(files) {
		var models = [];
		files.forEach(function(file) {
			models.push(this.registerModels(file));
		}.bind(this));
		return BPromise.all(files);
	}.bind(this));

	// return promise;
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
	return new BPromise(function(resolve, reject){
		let modelSchema = new Schema(fileSchema);
		hookFiles.forEach(function(hookFile) {
			let hookFunction = require(path.join(modelJsonFolder, fileName + '/' + hookFile));
			if(typeof hookFunction !== 'function') {
				console.log(fileName + ' ' + hookFile + ' does not export a function');
				// return reject(new Error(fileName + ' ' + hookFile + ' does not export a function'));
			}
			let loweredHookFile = hookFile.toLowerCase().split('_');
			let time = loweredHookFile[0] === 'after' ? 'post': 'pre';
			let action = loweredHookFile[1].split('.')[0];
			modelSchema[time](action, hookFunction);
			
		});
		resolve({
			model: db.model(fileName, modelSchema, fileName),
			name: fileName
		});
	});
};

module.exports = RegistryModel;
/*new RegistryModel().createModels().then(function(data) {
	console.log('here');
	console.log(data);
	var a = new RegistryModel();

}).catch(function(err) {
	console.log('err');
	console.log(err);
});*/