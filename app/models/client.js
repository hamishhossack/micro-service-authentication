'use strict';

var vogels = require('vogels'),
    Joi = require('joi'),
    properties = require('../../config/properties_' + (process.env.NODE_ENV || 'dev'));

vogels.AWS.config.update({
    accessKeyId: properties.dynamodb.key,
    secretAccessKey: properties.dynamodb.secret,
    region: properties.dynamodb.region
});

/**
 * Client Schema for Mongo collection
 * @type {*|Schema}
 */
var Client = vogels.define('Client', {

    hashKey: 'clientId',

    timestamps: true,

    schema: {
        site: Joi.string(),
        application: Joi.string(),
        clientId: Joi.string(),
        clientSecret: Joi.string()
    },

    tableName: properties.dynamodb.tableName
});

module.exports = Client;
