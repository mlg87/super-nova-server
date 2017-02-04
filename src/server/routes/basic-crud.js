const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');
const crud = require('../helpers/basic-crud');

module.exports = (table) => {

  router.all('*', authHelpers.checkAuthentication);

  router.get('/', (req, res, next) => {
    crud.getAll(table)
    .then((data) => {
      res.status(200).json({data});
    })
    .catch((err) => {
      res.status(500).json(`There was an error retrieving the ${table}`);
    });
  });

  router.post('/', (req, res, next) => {
    const newDoc = req.body;
    crud.addOne(table, {newDoc})
    .then((result) => {
      res.status(200).json({data: `Created new row in ${table}`});
    })
    .catch((err) => {
      res.status(500).json({err: err});
    });
  });

  router.put('/', (req, res, next) => {
    const id = req.body.id;
    delete req.body.id
    const editedFields = req.body;
    crud.editOne(table, id, {editedFields})
    .then(() => res.status(200).json({data: `Edited ${id} in ${table}`}))
    .catch((err) => res.status(500).json({err: err}));
  });

  router.delete('/', (req, res, next) => {
    const id = req.body.id;
    crud.deleteOne(table, id)
    .then(() => res.status(200).json({data: `Deleted ${id} in ${table}`}))
    .catch((err) => res.status(200).json({err: err}));
  });

  return router
};
