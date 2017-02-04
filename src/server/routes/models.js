const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');
const modelsHelpers = require('../helpers/models');

router.all('*', authHelpers.checkAuthentication);

router.get('/', (req, res, next) => {
  modelsHelpers.getAll()
  .then((models) => {
    res.status(200).json({data: models});
  })
  .catch((err) => {
    res.status(500).json('There was an error retrieving the models.');
  });
});

router.post('/', (req, res, next) => {
  const model = req.body.model;
  modelsHelpers.addOne(model)
  .then((result) => {
    res.status(200).json({data: 'Created new model'});
  })
  .catch((err) => {
    res.status(500).json({err: err});
  });
});

router.put('/', (req, res, next) => {
  const id = req.body.id;
  const newName = req.body.name;
  modelsHelpers.editOne(id, newName)
  .then(() => res.status(200).json({data: `Edited model`}))
  .catch((err) => res.status(500).json({err: err}));
});

router.delete('/', (req, res, next) => {
  const id = req.body.id;
  modelsHelpers.deleteOne(id)
  .then(() => res.status(200).json({data: `Deleted model`}))
  .catch((err) => res.status(200).json({err: err}));
});

module.exports = router;
