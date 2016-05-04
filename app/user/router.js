'use strict';

var express = require('express'),
    router = express.Router(),
    userController = require('./controller');

/**
 * User Create
 */
router.route('/')
    .post(userController.create);

module.exports = router;
