const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');
const sizeTypesHelpers = require('../helpers/size-types');

router.all('*', authHelpers.checkAuthentication);

router.get('/', (req, res, next) => {
  sizeTypesHelpers.getAll()
  .then((categories) => {
    res.status(200).json({data: categories});
  })
  .catch((err) => {
    res.status(500).json('There was an error retrieving the size types.');
  });
});

router.post('/', (req, res, next) => {
  const name = req.body.category;
  sizeTypesHelpers.addOne(name)
  .then((result) => {
    res.status(200).json({data: 'Created new size type'});
  })
  .catch((err) => {
    res.status(500).json({err: err});
  });
});

router.put('/', (req, res, next) => {
  const id = req.body.name;
  const newName = req.body.name;
  sizeTypesHelpers.editOne(id, newName)
  .then(() => res.status(200).json({data: `Edited size type`}))
  .catch((err) => res.status(500).json({err: err}));
});

router.delete('/', (req, res, next) => {
  const id = req.body.id;
  sizeTypesHelpers.deleteOne(id)
  .then(() => res.status(200).json({data: `Deleted size type`}))
  .catch((err) => res.status(200).json({err: err}));
});

module.exports = router;
