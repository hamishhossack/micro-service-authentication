'use strict';

var passport = require('passport'),
    _ = require('lodash'),
    env = process.env.NODE_ENV || 'dev',
    properties = require('../../config/properties_' + env),
    enabledStrategies = properties.strategies,
    currentStrategies = require('../utils/strategies');

/**
 * From the validate auth processes in config build each one to be used this the API.
 * This can be country dependant.
 */
enabledStrategies.forEach(function (strategy) {
    if (!_.has(currentStrategies, strategy)) {
        throw Error('This strategy ' + strategy + ' isn\'t Available');
    }
    passport.use(strategy, currentStrategies[strategy]());
});

exports.isAuthenticated = passport.authenticate('bearer', { session: false });
