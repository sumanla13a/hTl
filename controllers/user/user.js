'use strict';

// var BPromise = require('bluebird');
var _ = require('underscore');
var path = require('path');
var jwt = require('jsonwebtoken');

var User = require(path.join(global.appRoot, '/model/userModel'));
var app = require(path.join(global.appRoot, 'app'));
var Response = require(path.join(global.appRoot, 'lib/response'));

var passport = require('passport');
require(path.join(global.appRoot, 'lib/auth'))(passport);

var userMethods = {
	index: function(req, res, next) {
		res.send('respond with a resource');
	},
	authenticate: function(req, res, next) {
		User.findOne({
			'local.username': req.body.username
		}, function(err, user) {
			if(err || _.isEmpty(user)) {
				return next(err || new Error('No such user'));
			}
			if(User.validPassword(user.local.password)) {
				delete user.local.password;
				var token = jwt.sign(user, app.get('mySecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});
				res.json(new Response(1, token));
			}
		});
	},
	localAuthenticate: function(req, res, next){
		passport.authenticate('local-signup', function(err, user, info){
			if(err) {
				return next(err);
			}
			if(user) {
				return res.json(new Response(1, user));
			} else {
				return res.json(new Response(0, new Error(info)));
			}
		})(req, res, next);
	}
};

module.exports = userMethods;