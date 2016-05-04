'use strict';

var request = require('request'),
    crypto = require('crypto'),
    Q = require('q'),
    _ = require("lodash"),
    logger = require('log4js').getLogger(),
    env = process.env.NODE_ENV || 'dev',
    properties = require('../../config/properties_' + env);

/**
 * Send a request to the Search API to create a user.
 * @param user
 * @returns {*|promise}
 */
function sendUserToApi(user) {
    var deferred = Q.defer();

    if (!_.has(user, 'email') && !_.has(client, 'salt')) {
        throw new Error('User settings are incorrect');
    }

    request.post({
        url: properties.apis.search + '/users',
        json: true,
        body: user,
        headers: {
            'Content-Type': 'application/json',
            'site': user.site
        }
    }, function (err, response, body) {
        if (err) {
            deferred.reject(new Error(err));
        }

        if (!body.id) {
            deferred.reject(new Error('Not created a valid User'));
        }

        deferred.resolve(body);
    });

    return deferred.promise;
}

/**
 * We call ourself to gain authentication with token and pass back both user and token to client side
 * @param client
 * @param user
 * @returns {*|promise}
 */
function generateAuthTokenForUser(client, user) {
    var deferred = Q.defer();

    if (!_.has(client, 'client_id') && !_.has(client, 'client_secret')) {
        throw new Error('Client settings are incorrect');
    }

    var body = {
        "grant_type": "password",
        "client_id": client.client_id,
        "client_secret": client.client_secret,
        "username": user.email,
        "password": user.salt
    };

    request.post({
        url: properties.apis.auth + '/oauth/token',
        json: true,
        body: body,
        headers: {
            'Content-Type': 'application/json',
            'site': user.site
        }
    }, function (err, response, body) {
        if (err) {
            deferred.reject(new Error(err));
        }

        if (!body.access_token) {
            deferred.reject(new Error('Rejected from tokens'));
        }

        return deferred.resolve({tokens: body, user: user});
    });

    return deferred.promise;
}

/**
 * A Passer to create a user on auth with Search API
 * @param req
 * @param res
 */
function createUser(req, res) {
    if (!_.has(req.body, 'client')) {
        throw new Error('We need a Client to persist');
    }
    if (!_.has(req.body, 'user')) {
        throw new Error('We need a User to persist');
    }

    sendUserToApi(req.body.user)
        .then(function (user) {
            return generateAuthTokenForUser(req.body.client, user);
        })
        .then(function (result) {
            return res.json(result);
        })
        .fail(function (error) {
            logger.error("User Creation Failure", error);
            return res.status(404).json({message: 'Failed to create user'});
        });
}

module.exports = {
    create: createUser
};
