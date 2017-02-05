const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');

router.all('*', authHelpers.checkAuthentication);

router.get(`/:size_type_id`, (req, res, next) => {
  const size_type_id = req.params.size_type_id;
  knex('sizes').select().where('size_type_id', size_type_id)
  .then((data) => {
    res.status(200).json({ data });
  })
  .catch((err) => {
    res.status(500).json({error: err, message: 'An error occured whle retrieving sizes'});
  });
});

module.exports = router;
