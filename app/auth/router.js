'use strict';

var express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    oAuthController = require('./oauth'),
    authController = require('./controller');

/**
 * Authentication tester routes
 */
router.route('/test')
    .get(function (req, res) {
        res.json({
            test: 'No Auth Needed'
        });
    })
    .post(authController.isAuthenticated, function (req, res) {
        res.json({
            success: req.body
        });
    });

/**
 * Authentication
 */
router.route('/token')
    .post(oAuthController.token);

router.route('/facebook/callback')
    .get(
    function(req, res) {
        passport.authenticate('facebook_' + req.headers.site, function(e, user, info) {
            return res.json(e || user).send();
        })(req, res),
            function(e, user, info) {

        };

    });

module.exports = router;
