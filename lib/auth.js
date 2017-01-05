'use strict';


var path = require('path');
var _ = require('underscore');
var LocalStrategy   = require('passport-local').Strategy;

var config = require(path.join(global.appRoot, 'configurations/config.json')); 
var User = require(path.join(global.appRoot, 'model/userModel'));


function Auth(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done){
    	process.nextTick(function() {
    		User.findOne({'local.email': req.body.email}, function(err, user) {
    			if(err) {
					req.userError = err;

    				return done(err);
    			}
    			if(user) {
					req.userError = new Error('Email not available.');

    				return done(null, false, 'Email not available.');
    			} else {
    				user = new User();
    				user.local = {
    					email: req.body.email,
    					password: req.body.password,
    					username: req.body.username
    				};
    				user.save(function(err, res) {
    					if(err) {
    						req.userError = err;
    						return done(err);
    					}
    					if(res) {
    						delete res.local.password;
    					}
    					req.userInfo = res;
    					return done(null, res);
    				});
    			}
    		});
    	});
    }));
}

module.exports = Auth;