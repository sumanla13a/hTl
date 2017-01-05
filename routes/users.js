'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');

var User = require(path.join(global.appRoot, 'controllers/user/user'));


router.get('/', User.index);

router.post('/authenticate', User.authenticate);

router.post('/signup', User.localAuthenticate);
router.post('/login', User.localLogin);
router.get('/auth/facebook', User.facebookAuthenticate);
router.get('/auth/facebook/callback', User.facebookcallback);
router.get('/auth/twitter', User.twitterAuthenticate);
router.get('/auth/twitter/callback', User.twittercallback);
router.get('/auth/google', User.googleAuthenticate);
router.get('/auth/google/callback', User.googlecallback);
router.get('/logout', User.logout);
module.exports = router;
