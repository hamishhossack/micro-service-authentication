'use strict';

var request = require('request'),
    logger = require('log4js').getLogger(),
    BearerStrategy = require('passport-http-bearer').Strategy,
    BasicStrategy = require('passport-http').DigestStrategy,
    Basic2Strategy = require('passport-http').BasicStrategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    TokenBase = require('../models/tokenBase').client,
    Client = require('../models/client'),
    env = process.env.NODE_ENV || 'dev',
    sites = require('../../config/sites.json'),
    properties = require('../../config/properties_' + env);

/**
 * Authenticate with Search API using Basic username password
 * @returns {*|Strategy}
 */
function basic() {
    return new BasicStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {

            if (!req.headers.site) {
                done("No Valid Domain");
            }

            request.post({
                url: properties.apis.search + '/users/exists',
                json: true,
                body: {
                    'login': username,
                    'password': password,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'site': req.headers.site
                }
            }, function (err, res, user) {
                if (err) {
                    logger.error(err);
                    return done(err);
                }

                // No client found with that id or bad password
                if (!user || user.password !== password) {
                    return done(null, false);
                }

                // Success
                return done(null, user);
            });
        }
    )
}

/**
 * Authenticate with Search API user check hashed password
 * @returns {*|Strategy}
 */
function client() {
    return new ClientPasswordStrategy(function (clientId, clientSecret, done) {
        Client
            .query(clientId)
            .exec(function(err, resp) {
                if (err) {
                    logger.error(err);
                    return done(err);
                }

                if (!resp.Count > 0) {
                    return done(false);
                }

                var client = resp.Items[0].attrs;

                if (client.clientSecret !== clientSecret) {
                    return done(false);
                }

                return done(null, client);
            });
        });
}

/**
 * Authenticate with Web Tokens on the User (Bearer Strategy)
 * @returns {*|Strategy}
 */
function bearer() {
    return new BearerStrategy(function (accessToken, done) {
        TokenBase
            .get(accessToken, function (err, record) {
                if (err) {
                    logger.error(err);
                    return done(err);
                }

                if (!record) {
                    return done(null, false);
                }

                var token = JSON.parse(record);

                if (Math.round((Date.now() - token.created) / 1000) > properties.security.tokenLife) {

                    TokenBase.del(accessToken);

                    return done(null, {message: 'Token expired'});
                }

                var getUserById = properties.apis.search + '/users/' + token.userId;

                request.get(getUserById, {
                    headers: {
                        Authorization: 'Bearer ' + properties.security.token,
                        site: token.site
                    }
                }, function (err, res, body) {
                    if (err) {
                        logger.error(err);
                        return done(err);
                    }

                    var user = JSON.parse(body);
                    if (!user.id) {
                        return done(null, {message: "Unknown User"});
                    }

                    return done(null, user, {scope: user.roles ? user.roles.join(', ') : 'user'});
                });
            });
    });
}

/**
 * A Strategy to authenticate with twitter API and create a user with search
 * @returns {Strategy}
 */
function twitter() {
    return new TwitterStrategy({
            consumerKey: TWITTER_CONSUMER_KEY,
            consumerSecret: TWITTER_CONSUMER_SECRET,
            callbackURL: "http://www.example.com/auth/twitter/callback",
            passReqToCallback: true
        },
        function (req, token, tokenSecret, profile, done) {
            if (!req.user) {
                // Not logged-in. Authenticate based on Twitter account.
            } else {
                // Logged in. Associate Twitter account with user.  Preserve the login
                // state by supplying the existing user after association.
                // return done(null, req.user);
            }
        }
    );
}

var facebookCallback = function(token, e, refreshToken, profile, done, site) {
    var getUserByFacebookId = properties.apis.search + '/users?facebook_uid=' + profile.id + '&site=' + site;
    request.get(getUserByFacebookId, {headers: {Authorization: 'Bearer ' + properties.security.token}}, function (err, res) {
        if (err) {
            return done(err);
        }
        var user = JSON.parse(res.body);
        if (typeof(user.id) === 'undefined') {
            profile._json['new'] = true;
            return done(
                profile._json
            );
        }

        return done(null, user);
    });
}

var strategies = {
    basic: basic,
    client: client,
    bearer: bearer,
    twitter: twitter
}

Object.keys(sites).forEach(function(site) {
    var facebookConfig = sites[site].socials.facebook;
    var facebookCallbackInformation = properties.socials.facebook.callback;
    strategies['facebook_' + site] = function() {
        return new FacebookStrategy({
            profileFields: ['id', 'displayName', 'email', 'name'],
            clientID: facebookConfig.clientID,
            clientSecret: facebookConfig.clientSecret,
            callbackURL: facebookCallbackInformation.scheme + '://' +
            facebookCallbackInformation.prefix + '.' +
            site +
            facebookCallbackInformation.port + '/connect/facebook/callback'
        },
            function(token, e, refreshToken, profile, done) {
                facebookCallback(token, e, refreshToken, profile, done, site);
            });
    }
})

module.exports = strategies;
