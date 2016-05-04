'use strict';

var vogels = require('vogels');
var Q = require('q');
var properties = require('../config/properties_' + (process.env.NODE_ENV || 'dev'));

/**
 * Database
 */
vogels.AWS.config.update({
    accessKeyId: properties.dynamodb.key,
    secretAccessKey: properties.dynamodb.secret,
    region: properties.dynamodb.region
});

var Client = require('../app/models/client');

Q
    .all(require('../data/client').map(createItem))
    .then(function (client) {
        console.log('Finished', client.attrs.site);
        process.exit(1);
    })
    .catch(function (err) {
        throw err;
    });

/**
 * Create Client in DynamoDB
 * @param client
 */
function createItem (client) {
    var deferred = Q.defer();

    Client.create(client, {}, function (err, response) {

        if (err) {
            console.log(err);
            return deferred.reject(err);
        }

        deferred.resolve(response);
    });

    return deferred.promise;
}
