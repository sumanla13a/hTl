'use strict';

var express = require('express');
var router = express.Router();

var collectionCtrl = require('../controllers/collection').collection;

router.get('/', collectionCtrl.loadCollections);

router.post('/new', collectionCtrl.getCollectionData, collectionCtrl.createCollections);

router.post('/default_user', collectionCtrl.useInBuiltUser);

router.post('/oauth/settings', collectionCtrl.useOauth);
module.exports = router;
