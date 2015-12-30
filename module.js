'use strict';

var session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose');

module.exports = function (app, config, router) {
    mongoose.set('debug', (config.mongo && config.mongo.debug) || false);

    router.session(session({
        secret: config.secret || 'MYSECRETSESSIONTOKEN',
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        }),
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: null
        },
        name: 'connect.sid',
        resave: true,
        saveUninitialized: true
    }));

    var mongoUri = process.env.MONGO_URI || (config.mongo && config.mongo.uri);
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
