'use strict';

var express = require('express');
var router = express.Router();

var collectionCtrl = require('../controllers/collection').collection;

router.get('/', collectionCtrl.loadCollections);
router.post('/', collectionCtrl.getCollectionData, collectionCtrl.createCollections);
router.get('/:name', collectionCtrl.loadCollectionByName);

router.post('/default_user', collectionCtrl.useInBuiltUser);

router.get('/path/:name', collectionCtrl.getAllRoutes);

router.post('/oauth/settings', collectionCtrl.useOauth);
module.exports = router;
