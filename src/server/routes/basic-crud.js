const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');
const crud = require('../helpers/basic-crud');

module.exports = (table) => {

  router.all('*', authHelpers.checkAuthentication);

  router.get(`/${table}/some`, (req, res, next) => {
    crud.getSome(table, req.query)
    .then((data) => {
      res.status(200).json({data});
    })
    .catch((err) => {
      res.status(500).json({error: err, message: `There was an error retrieving the ${table}`});
    });
  });

  router.get(`/${table}/:id`, (req, res, next) => {
    const id = req.params.id;
    crud.getOne(table, id)
    .then((data) => {
      res.status(200).json({data});
    })
    .catch((err) => {
      res.status(500).json({error: err, message: `There was an error retrieving the ${table}`});
    });
  });

  router.get(`/${table}`, (req, res, next) => {
    crud.getAll(table)
    .then((data) => {
      res.status(200).json({data});
    })
    .catch((err) => {
      res.status(500).json({error: err, message: `There was an error retrieving the ${table}`});
    });
  });

  router.post(`/${table}`, (req, res, next) => {
    let newDoc = req.body;
    // some routes call were set up with the body like so {table: {newDoc}}
    // so this little work around will do for now
    if (newDoc[table]) {
      newDoc = newDoc[table];
    }
    crud.addOne(table, [newDoc])
    .then((result) => {
      res.status(200).json({data: `Created new row in ${table}`});
    })
    .catch((err) => {
      res.status(500).json({error: err, message: });
    });
  });

  router.put(`/${table}`, (req, res, next) => {
    const id = req.body.id;
    delete req.body.id;
    const editedFields = req.body;
    crud.editOne(table, id, [editedFields])
    .then(() => res.status(200).json({data: `Edited ${id} in ${table}`}))
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: 'There was an error editing the doc'
      });
    });
  });

  router.delete(`/${table}`, (req, res, next) => {
    const id = req.body.id;
    crud.deleteOne(table, id)
    .then(() => res.status(200).json({data: `Deleted ${id} in ${table}`}))
    .catch((err) => {
      res.status(200).json({
        error: err,
        message: 'There was an error deleting the doc'
      });
    });
  });

  return router;
};
