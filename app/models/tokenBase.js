'use strict';

var redis = require('redis');
var logger = require('log4js').getLogger();
var env = process.env.NODE_ENV || 'dev';
var properties = require('../../config/properties_' + env);

var tokenBase = redis.createClient(properties.redis.post, properties.redis.host);

tokenBase.on('connect', function () {
    logger.info('Connection to redis `token` established');

    var admin = {
        userId: properties.security.userId,
        clientId: properties.security.clientId,
        site: 'coruscant.pada.io',
        scope: ['admin']
    };

    tokenBase.set(properties.security.token, JSON.stringify(admin));
});

module.exports = {
    client: tokenBase
};
