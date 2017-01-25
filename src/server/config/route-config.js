(function (routeConfig) {

  'use strict';

  const router = require('express').Router()

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/routes');

    // *** register routes *** //

    router.use('/auth/', routes.auth);
    router.use('/users/', routes.users)

    router.use('/inventory/', routes.inventory);

    // prepend api to everything
    app.use('/api', router)

  };

})(module.exports);
