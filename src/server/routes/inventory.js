const express = require('express');
const router = express.Router();
const knex = require('../db/connection');

router.get('/inventory/search', (req, res) => {
  const { search_terms, category_id } = req.headers;
  return knex.raw('SELECT * FROM search_inventory(?, ?, ?)', [search_terms, +category_id, null])
  .then((result) => {
    res.status(200).json({data: result.rows});
  })
  .catch((err) => {
    res.status(500).json({error: 'An error ocurred while fetching inventory.'});
  });
});

module.exports = router;
