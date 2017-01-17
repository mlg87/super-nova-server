(function (routeConfig) {

  'use strict';

  const router = require('express').Router()

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/routes');

    // *** register routes *** //

    router.use('/auth/', routes.auth);

    const prefix = process.env.NODE_ENV == 'development' ? '/api' : ''
    // use the router on the app
    app.use(prefix, router)

  };

})(module.exports);
