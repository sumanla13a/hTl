'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');

var User = require(path.join(global.appRoot, 'controllers/user/user'));


router.get('/', User.index);

router.post('/authenticate', User.authenticate);

router.post('/signup', User.localAuthenticate);
module.exports = router;
