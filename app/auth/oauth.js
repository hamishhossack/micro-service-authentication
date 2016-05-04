'use strict';

var oauth2orize = require('oauth2orize'),
    passport = require('passport'),
    request = require('request'),
    crypto = require('crypto'),
    logger = require('log4js').getLogger(),
    env = process.env.NODE_ENV || 'dev',
    properties = require('../../config/properties_' + env),
    RedisClient = require('../models/tokenBase').client,
    moment = require('moment'),
    Client = require('../models/client');

/**
 * Generate the oAuth2 Server for authentication
 * @type {*|{listen}|Server}
 */
var server = oauth2orize.createServer();

/**
 * Generate tokens based with data provided from exchange and user
 * @param data
 * @param done
 */
function generateTokens(data, done) {
    var refreshTokenValue,
        tokenValue;

    tokenValue = crypto.randomBytes(16).toString('hex');
    refreshTokenValue = crypto.randomBytes(16).toString('hex');

    data.token = tokenValue;
    data.created = Date.now();

    RedisClient.set(refreshTokenValue, JSON.stringify(data));
    RedisClient.expire(refreshTokenValue, properties.security.tokenlife);

    RedisClient.set(tokenValue, JSON.stringify(data), function (err, record) {
        if (err) {
            return done(err);
        }

        RedisClient.expire(tokenValue, properties.security.tokenlife);

        done(null, tokenValue, refreshTokenValue, {
            'expires_in': properties.security.tokenLife
        });
    });
}

/**
 * Server serializing for a the app Client
 */
server.serializeClient(function (client, done) {
    return done(null, client.id);
});

/**
 * Server deserialize for the app Client
 */
server.deserializeClient(function (id, done) {
    Client.query(id).exec(function (err, client) {
        if (err) {
            return done(err);
        }
        return done(null, client);
    });
});

/**
 * Server exchange for generating a token with password and app client.
 */
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
    var getUserByEmail = properties.apis.search + '/users?email=' + encodeURIComponent(username) + '&site=' + client.site;

    if (!username || !password) return done(null, {message: 'Required fields missing'});

    request.get(getUserByEmail, {headers: {Authorization: 'Bearer ' + properties.security.token}}, function (err, res) {
        if (err) {
            return done(err);
        }

        var user = JSON.parse(res.body);

        if (!user.id || user.password !== password) {
            return done({message: 'Invalid User'});
        }

        var updateUser = properties.apis.search + '/users/' + user.id;
        var body = {"dates": {"last_login": moment().format("Y-MM-DTH:m:sZ")}};
        var headers = {Authorization: 'Bearer ' + properties.security.token, site: client.site};

        var options = {
            url : updateUser,
            headers: headers,
            body: body,
            json: true,
        };

        request.put(options, function (error, response, body) {
            if (error) {
                logger.error(error);
                return done({message: 'Update of user last_login failed for user : ' + user.id});
            }

            logger.trace('Update of field last_login successful for user : ' + user.id);
        });

        var model = {
            userId: user.id,
            application: client.application,
            scope: scope,
            clientId: client.clientId,
            site: client.site
        };

        generateTokens(model, done);
    });
}));

/**
 * Server exchange for generating a token with the app client.
 */
server.exchange(oauth2orize.exchange.clientCredentials(function (client, scope, done) {

    var model = {
        userId: 'anonymous',
        application: client.application,
        scope: scope,
        clientId: client.clientId,
        site: client.site
    };

    generateTokens(model, done);
}));

/**
 * Server Exchange for oAuth2 refreshToken if invalid.
 */
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
    RedisClient.findOne(refreshToken, function (err, token) {
        if (err) {
            return done(err);
        }
        if (!token) {
            return done(false);
        }

        var getUserById = properties.apis.search + '/users/' + token.userId;
        request.get(getUserById, {
            headers: {
                Authorization: 'Bearer ' + properties.security.token,
                site: client.site
            }
        }, function (err, res) {
            if (err) {
                return done(err);
            }

            var user = JSON.parse(res.body);

            if (!user.id) {
                return done({message: 'Invalid User'});
            }

            var model = {
                userId: user.userId,
                clientId: client.clientId,
                site: client.site,
                scope: client.scope
            };

            generateTokens(model, done);
        });
    });
}));

/**
 * User decision endpoint `decision` middleware processes a user's decision to allow or deny access requested by a
 * client application.
 * @type {*[]}
 */
exports.decision = [
    server.decision()
];

/**
 * Token endpoint `token` middleware handles client requests to exchange authorization grants for access tokens.
 * @type {*[]}
 */
exports.token = [
    passport.authenticate(['basic', 'client'], {session: false, passReqToCallback: true}),
    server.token(),
    server.errorHandler()
];
