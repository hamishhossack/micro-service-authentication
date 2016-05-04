'use strict';

var express = require('express'),
    app = require('express')(),
    morgan = require('morgan'),
    passport = require('passport'),
    util = require('util'),
    fs = require('fs'),
    vogels = require('vogels'),
    http = require('http'),
    join = require('path').join,
    bodyParser = require('body-parser'),
    _ = require('lodash'),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    compression = require('compression'),
    env = process.env.NODE_ENV || 'dev',
    properties = require('./config/properties_' + env);

require('events').EventEmitter.prototype._maxListeners = 100;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));

/**
 * Custom Libraries
 */

app.use(compression());

/**
 * Logger
 */

morgan.token('id', function getId(req) {
    return req.headers.authorization || 'Uninitialized';
});
var accessLogStream = fs.createWriteStream(__dirname + '/out.log', {flags: 'a'});
app.use(morgan("[:id] :status :method :url :response-time ms", {
    "stream": accessLogStream
}));

/**
 * Routing & Security
 */

app.set('trust proxy', 'loopback' + (properties.safe.length > 0 ? ', ' + _.join(properties.safe, ', ') : ''));
//app.use(express.static(__dirname + '/public')); // todo : If we want to use any static content

app.use('/api', require('./app/router'));
app.use('/api/user', require('./app/user/router'));
app.use('/api/auth', require('./app/auth/router'));

/**
 * Passport
 */

app.use(passport.initialize());
require('./app/auth/controller');

/**
 * Listen on port
 */

app.listen(properties.port.http, function () {
    logger.info('Auth API initialized on', env, 'with port', properties.port.http);
});
