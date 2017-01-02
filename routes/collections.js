'use strict';

var express = require('express');
var router = express.Router();

var collectionCtrl = require('../controllers/collection').collection;
/* GET users listing. */
router.get('/', collectionCtrl.loadCollections);

router.post('/new', collectionCtrl.getCollectionData, collectionCtrl.createCollections);

module.exports = router;
