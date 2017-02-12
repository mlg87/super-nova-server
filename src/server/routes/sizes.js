const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../helpers/auth');
const sizes = require('../helpers/sizes');

router.all('*', authHelpers.checkAuthentication);

router.get(`/item_type/:item_type_id`, (req, res, next) => {
  const item_type_id = req.params.item_type_id;
  sizes.getWithItemType(item_type_id)
  .then((data) => {
    res.status(200).json({ data: data.rows });
  })
  .catch((err) => {
    res.status(500).json({error: err, message: 'An error occured whle retrieving sizes'});
  });
});

module.exports = router;
