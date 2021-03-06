const express = require('express');
const router = express.Router();
const knex = require('../db/connection');

router.get('/search', (req, res) => {
  return knex.raw('SELECT * FROM search_customers(?, ?)', [req.headers.search_term, null])
  .then((result) => {
    res.status(200).json(result.rows);
  })
  .catch((err) => {
    res.status(500).json({
      error: err,
      message: 'An error ocurred while fetching customers.'
    });
  });
});

module.exports = router;
