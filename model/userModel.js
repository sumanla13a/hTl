'use strict';
var db = require('../lib/db.js');

var bcrypt = require('bcrypt');
const saltRounds = 10;
console.log('require');
var BluePromise = require('bluebird');
var Schema = db.Schema;

var localSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {_id: false});

var userSchema = new Schema({
	local: localSchema,
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
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
		bcrypt.hash(this.local.password, salt, function(err, hash) {
			console.log('here');
			this.local.password = hash; 
			next();
		}.bind(this));
	}.bind(this)).catch(function(err) {
		// TODO: throw error from here later
		next(err);
		console.log(err);
	});
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var user = db.model('user', userSchema, 'user');

module.exports = user;