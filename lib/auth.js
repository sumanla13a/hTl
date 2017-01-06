'use strict';


var path = require('path');
var _ = require('underscore');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var authconfig = require(path.join(global.appRoot, 'configurations/auth.json')); 
var User = require(path.join(global.appRoot, 'model/userModel'));
var BluePromise = require('bluebird');
var bcrypt = require('bcrypt');

const saltRounds = 10;

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
                    var hash = new BluePromise(function(resolve, reject) {
                        bcrypt.genSalt(saltRounds, function(err, salt) {
                            if(err) {
                                reject(err);
                            }
                            resolve(salt);
                        });
                    });
                    hash.then(function(salt) {
                        return new BluePromise(function(resolve, reject) {
                            bcrypt.hash(user.local.password, salt, function(err, hash) {
                                user.local.password = hash; 
                                if(err) {
                                    reject(err);
                                }
                                resolve(hash);
                            });
                        });
                    }).then(function(){
                        return user.save();
                    }).then(function(res){
                        delete res.local.password;
                        return done(null, res);
                    }).catch(function(err) {
                        return done(err);
                    });
    			}
    		});
    	});
    }));

    passport.use('local-login', new LocalStrategy({
    	usernameField: 'email',
    	passwordField: 'password',
    	passReqToCallback: true
    }, function(req, email, password, done) {
    	User.findOne({
			'local.email': email
		}, function(err, user) {
			if(err) {
				return done(err);
			}
			if(_.isEmpty(user)) {
				done(null, false, 'No Such User.');
			}
			if(user.validPassword(password)) {
				user = user.toObject();
				delete user.local.password;
				return done(null, user);
			} else {
				return done(null, false, 'Wrong Password');
			}
		});
    }));
    if(authconfig.facebookAuth) {
        passport.use(new FacebookStrategy({
            clientID: authconfig.facebookAuth.clientID,
            clientSecret: authconfig.facebookAuth.clientSecret,
            callbackURL: authconfig.facebookAuth.callbackURL
        }, function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user){
                    if(err) {
                        return done(err);
                    }
                    if(user) {
                        return done(null, user);
                    } else {
                        var newUser = new User({
                            facebook: {
                                id: profile.id,
                                token: token,
                                name: profile.name.givenName + ' ' + profile.name.familyName,
                                email: profile.emails[0].value
                            } 
                        });
                        newUser.save(function(err) {
                            if(err) {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            })
        }));
    }

    if(authconfig.twitterAuth) {
        passport.use(new TwitterStrategy({
            consumerKey     : authconfig.twitterAuth.consumerKey,
            consumerSecret  : authconfig.twitterAuth.consumerSecret,
            callbackURL     : authconfig.twitterAuth.callbackURL
        }, function(token, tokenSecret, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save(function(err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
    }

    if(authconfig.googleAuth) {
        passport.use(new GoogleStrategy({
            clientID        : authconfig.googleAuth.clientID,
            clientSecret    : authconfig.googleAuth.clientSecret,
            callbackURL     : authconfig.googleAuth.callbackURL,
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser          = new User();
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email

                        newUser.save(function(err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));
    }
}

module.exports = Auth;