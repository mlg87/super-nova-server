const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');
const brandsHelpers = require('../helpers/brands');

router.all('*', authHelpers.checkAuthentication);

router.get('/', (req, res, next) => {
  brandsHelpers.getAll()
  .then((brands) => {
    res.status(200).json({data: brands});
  })
  .catch((err) => {
    res.status(500).json('There was an error retrieving the brands.');
  });
});

router.post('/', (req, res, next) => {
  const name = req.body.name;
  brandsHelpers.addOne(name)
  .then((result) => {
    res.status(200).json({data: 'Created new brand'});
  })
  .catch((err) => {
    res.status(500).json({err: err});
  });
});

router.put('/', (req, res, next) => {
  const id = req.body.id;
  const newName = req.body.name;
  brandsHelpers.editOne(id, newName)
  .then(() => res.status(200).json({data: `Edited brand`}))
  .catch((err) => res.status(500).json({err: err}));
});

router.delete('/', (req, res, next) => {
  const id = req.body.id;
  brandsHelpers.deleteOne(id)
  .then(() => res.status(200).json({data: `Deleted brand`}))
  .catch((err) => res.status(200).json({err: err}));
});

module.exports = router;
