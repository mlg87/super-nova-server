const express = require('express');
const router = express.Router();
const knex = require('../db/connection');

router.post('/add', (req, res) => {
  const {
    customer_id,
    user_id,
    startDate,
    endDate,
    inventory_ids
  } = req.body

  knex.transaction((trx) => {
    return trx
      .insert({
        customer_id,
        user_id,
        date_range: `[${startDate}, ${endDate}]`
      }, 'id')
      .into('reservations')
      .then((reservation_ids) => {
        const reservation_id = reservation_ids[0]
        const promises = inventory_ids.map((item_id) => {
          return trx.insert({reservation_id, item_id})
            .into('join_reservations_inventory')
        })
        return Promise.all(promises)
      })
      .then((inserts) => {
        res.status(200)
      })
      .catch((err) => {
        res.status(400)
      })

  })
});

module.exports = router;
