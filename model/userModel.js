'use strict';
var db = require('../lib/db.js');

var bcrypt = require('bcrypt');
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
	next();
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var user = db.model('user', userSchema, 'user');
global.models.user = user;
module.exports = user;