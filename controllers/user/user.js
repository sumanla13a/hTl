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
	},
	localLogin: function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			if(err) {
				return next(err);
			}
			if(_.isEmpty(user)) {
				return res.json(new Response(0, new Error(info)));
			}
			return res.json(new Response(1, user));
		})(req, res, next);
	},
	facebookAuthenticate: function(req, res, next) {
		passport.authenticate('facebook', { scope : 'email' })(req, res, next);
	},
	facebookcallback: function(req, res, next) {
		passport.authenticate('facebook', function(err, user, info) {
			console.log(arguments);
		})(req,res,next);
	},
	twitterAuthenticate: function(req, res, next) {
		passport.authenticate('twitter')(req, res, next);
	},

	twittercallback: function(req, res, next) {
		passport.authenticate('twitter', {
			successRedirect : '/',
			failureRedirect : '/'
		})(req, res, next);
	},
	googleAuthenticate: function(req, res, next) {
		passport.authenticate('google', { scope : ['profile', 'email'] })(req, res, next);
	},
	googlecallback: function(req, res, next) {
		passport.authenticate('google', {
                    successRedirect : '/',
                    failureRedirect : '/'
            })(req, res, next);
	},
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	}
};

module.exports = userMethods;