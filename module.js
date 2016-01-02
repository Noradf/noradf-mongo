'use strict';

var session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose');

module.exports = function (app, config, router) {
    mongoose.set('debug', (config.mongo && config.mongo.debug) || true);

    router.session(session({
        secret: (config.mongo && config.mongo.sessionToken) || 'MYSECRETSESSIONTOKEN',
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        }),
        cookie: {
            path: (config.router && config.router.session && config.router.session.cookiePath) || '/',
            httpOnly: true,
            secure: false,
            maxAge: null
        },
        name: (config.router && config.router.session && config.router.session.cookieName) || 'connect.sid',
        resave: true,
        saveUninitialized: true
    }));

    var mongoUri = process.env.MONGO_URI || (config.mongo && config.mongo.uri) || 'localhost/test';
    if (!mongoUri) {
        throw new Error('Mongo Uri is not provided');
    }

    mongoose.connect(mongoUri, function (error) {
        if (error) {
            return console.error(error); //FIXME
        }

        console.log('Connected to ' + mongoUri);
    });
};
