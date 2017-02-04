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
    router.use('/categories/', routes.categories);
    router.use('/brands/', routes.brands);
    router.use('/models/', routes.models);
    router.use('/size_types/', routes.size_types);
    router.use('/item_types/', routes.item_types);
    router.use('/inventory/', routes.inventory);
    router.use('/customers/', routes.customers);
    router.use('/reservations/', routes.reservations);

  };

})(module.exports);
