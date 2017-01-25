const express = require('express');
const router = express.Router();
const knex = require('../db/connection');

router.get('/search', (req, res) => {
  return knex.raw('SELECT * FROM search_inventory(?, ?)', [req.headers.search_terms, null])
  .then((result) => {
    res.status(200).json(result.rows);
  })
  .catch((err) => {
    res.status(500).json({message: 'An error ocurred while fetching inventory.'});
  });
});

module.exports = router;