(function (routeConfig) {

  'use strict';

  const router = require('express').Router();

  routeConfig.init = function (app) {

    // prepend api to everything
    app.use('/api', router);

    // *** routes *** //
    const routes = require('../routes/routes');

    // *** register routes *** //

    router.use('/auth/', routes.auth);
    router.use('/users/', routes.users);
    router.use('/inventory/', routes.inventory);
    router.use('/customers/', routes.customers);
    router.use('/reservations/', routes.reservations);
    router.use('/sizes', routes.sizes);

    // using the basic crud routes
    router.use('/', routes.categories);
    router.use('/', routes.brands);
    router.use('/', routes.models);
    router.use('/', routes.size_types);
    router.use('/', routes.item_types);
  };

})(module.exports);
