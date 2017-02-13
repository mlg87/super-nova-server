const express = require('express')
const router = express.Router()
const knex = require('../db/connection')

router.get('/all', (req, res) => {
  return knex('users').select('id', 'username', 'created_at')
  .then((users) => {
    res.status(200).json({data: users})
  })
  .catch((err) => {
    res.status(500).json({error: err, message: 'Oh man we fucked up big!'})
  })
})

router.delete('/remove', (req, res) => {
  const { ids } = req.body
  return knex('users').whereIn('id', ids).del()
  .then((count) => {
    // delete returns a count of the rows deleted, sending back the ids so we can
    // pull them from the arr on the client and get that updated without doing
    // another fetch
    res.status(200).json({data: ids})
  })
  .catch((err) => {
    res.status(500).json({error: err, message: 'Oops. We didn\'t get those users deleted :/'})
  })
})

module.exports = router
