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

router.post('/', (req, res, next) => {
  const itemTypeObject = req.body.itemType;
  itemTypesHelpers.addOne(itemTypeObject)
  .then((result) => {
    res.status(200).json({data: 'Created new item type'});
  })
  .catch((err) => {
    res.status(500).json({err: err});
  });
});

router.put('/', (req, res, next) => {
  const itemTypeObject = req.body.itemType;
  itemTypesHelpers.editOne(itemTypeObject)
  .then(() => res.status(200).json({data: `Edited item type`}))
  .catch((err) => res.status(500).json({err: err}));
});

router.delete('/', (req, res, next) => {
  const id = req.body.id;
  itemTypesHelpers.deleteOne(id)
  .then(() => res.status(200).json({data: `Deleted item type`}))
  .catch((err) => res.status(500).json({err: err}));
});

module.exports = router;
