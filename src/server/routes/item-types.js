const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');
const itemTypesHelpers = require('../helpers/item-types');

router.all('*', authHelpers.checkAuthentication);

router.get('/', (req, res, next) => {
  itemTypesHelpers.getAll()
  .then((itemTypes) => {
    res.status(200).json({data: itemTypes});
  })
  .catch((err) => {
    res.status(500).json({err: err});
  });
});

module.exports = router;
