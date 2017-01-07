const express = require('express');
const router = express.Router();
const authHelpers = require('../helpers/auth');
const knex = require('../db/connection');

router.post('/register', (req, res, next)  => {
  authHelpers.createUser(req)
    .then((user) => { return authHelpers.encodeToken(user[0]); })
    .then((token) => {
      res.status(200).json({
        token: token,
        message: `Success. '${token.username}' has been created.`
      });
    })
    .catch((err) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(400).json({message: 'Regsitration failed'});
      }
    });
});

router.post('/login', (req, res, next) => {
  const username = req.body.user.username;
  const password = req.body.user.password;
  return knex('users').where({username}).first()
  .then((user) => {
    authHelpers.comparePass(password, user.password);
    return user;
  })
  .then((user) => { return authHelpers.encodeToken(user); })
  .then((token) => {
    res.status(200).json({
      message: 'Success',
      token: token
    });
  })
  .catch((err) => {
    res.status(400).json({message: 'Login failed.'});
  });
});

// ** helper routes ** //

router.get('/current_user', authHelpers.checkAuthentication, (req,res) => {
  knex('users').where({id: parseInt(req.user.id)}).first()
  .then((user) => {
    let result = Object.assign({}, user);
    delete result.password;
    res.status(200).json({data: result});
  })
  .catch((err) => {
    res.status(500).json({message: 'An error ocurred while getting the current user.'});
  });
});

module.exports = router;
