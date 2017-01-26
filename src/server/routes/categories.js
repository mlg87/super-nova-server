const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');
const categoriesHelpers = require('../helpers/categories');

router.all('*', authHelpers.checkAuthentication);

router.get('/', (req, res, next) => {
  categoriesHelpers.getAll()
  .then((categories) => {
    res.status(200).json({data: categories});
  })
  .catch((err) => {
    res.status(500).json('There was an error retrieving the categories.');
  });
});

router.post('/', (req, res, next) => {
  const name = req.body.category;
  categoriesHelpers.addOne(name)
  .then((result) => {
    res.status(200).json({data: 'Created new category'});
  })
  .catch((err) => {
    res.status(500).json({err: err});
  });
});

module.exports = router;
