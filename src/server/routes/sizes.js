const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');

router.all('*', authHelpers.checkAuthentication);

router.get(`/item_type/:item_type_id`, (req, res, next) => {
  const item_type_id = req.params.item_type_id;
  knex.raw(
    `SELECT * FROM item_types AS i
    INNER JOIN sizes ON i.size_type_id = sizes.size_type_id
    WHERE i.id = ?`,
    [item_type_id]
  )
  .then((data) => {
    console.log(data);
    res.status(200).json({ data: data.rows });
  })
  .catch((err) => {
    res.status(500).json({error: err, message: 'An error occured whle retrieving sizes'});
  });
});

module.exports = router;
