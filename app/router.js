'use strict';

var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    env = process.env.NODE_ENV || 'dev',
    properties = require('../config/properties_' + env),
    utils = require('./utils/utils');

/**
 * Configuration Middleware
 */
router.use(function configure(req, res, next) {
    req.headers.site = utils.getSiteFromRequest(req);

    next();
});

/**
 * Welcome
 */
router.route('/')
    .get(function (req, res) {
        res.json({
            welcome: 'Authentication API ' + properties.version
        });
    });

module.exports = router;
