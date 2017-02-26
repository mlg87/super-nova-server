(function() {

  'use strict';
  // travis again and again
  // *** dependencies *** //
  const express = require('express');

  const appConfig = require('./config/main-config.js');
  const routeConfig = require('./config/route-config.js');
  const errorConfig = require('./config/error-config.js');

  // *** express instance *** //
  const app = express();

  // *** config *** //
  appConfig.init(app, express);
  routeConfig.init(app);
  errorConfig.init(app);

  console.log('Environment is ' + process.env.NODE_ENV);
  module.exports = app;

}());
