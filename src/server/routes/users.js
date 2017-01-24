const express = require('express')
const router = express.Router()
const knex = require('../db/connection')

router.get('/all', (req, res) => {
  return knex('users').select('username', 'created_at')
  .then((users) => {
    res.status(200).json({data: users})
  })
  .catch((err) => {
    res.status(500).json({message: 'Oh man we fucked up big!'})
  })
})

module.exports = router
