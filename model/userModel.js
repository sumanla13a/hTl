'use strict';
var db = require('../lib/db.js');

var bcrypt = require('bcrypt');
const saltRounds = 10;

var BluePromise = require('bluebird');
var Schema = db.Schema;
var userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date
	},
	updatedAt: {
		type: Date
	}
});

userSchema.pre('save', function (next) {
	if (!this.createdAt) {
		this.createdAt = new Date();
	}
	this.updatedAt = new Date();
	var hash = new BluePromise(function(resolve, reject) {
		bcrypt.genSalt(saltRounds, function(err, salt) {
			if(err) {
				reject(err);
			}
			resolve(salt);
		});
	});
	hash.then(function(salt) {
		bcrypt.hash(this.password, salt, function(err, hash) {
			this.password = hash; 
			next();
		}.bind(this));
	}.bind(this)).catch(function(err) {
		// TODO: throw error from here later
		console.log(err);
	});
});

var user = db.model('user', userSchema, 'user');

module.exports = user;