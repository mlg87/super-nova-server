const express = require('express');
const router = express.Router();
const authHelpers = require('../helpers/auth');
const knex = require('../db/connection');

router.post('/register', (req, res)  => {
  authHelpers.createUser(req)
  .then((user) => { return authHelpers.encodeToken(user[0]); })
  .then((token) => {
    res.status(200).json({
      token: token,
      message: `Success. '${token.username}' has been created.`
    });
  })
  .catch((err) => {
    res.status(400).json({
      error: err,
      message: 'Regsitration failed'
    });
  });
});

router.post('/login', (req, res) => {
  const username = req.body.user.username;
  const password = req.body.user.password;
  return knex('users').where({username}).first()
  .then((user) => {
    if (!user) {
      return Promise.reject({message: 'Incorrect username'});
    }
    else if (authHelpers.comparePass(password, user.password)) {
      return {
        token: authHelpers.encodeToken(user),
        id: user.id
      };
    }
    return Promise.reject({message: 'Incorrect password'});
  })
  .then((userInfo) => {
    res.status(200).json({
      message: 'Success',
      token: userInfo.token,
      id: userInfo.id
    });
  })
  .catch((err) => {
    res.status(400).json({
      error: err,
      message: err.message || 'Login Failed'});
  });
});

// ** helper routes ** //
router.get('/current_user', authHelpers.checkAuthentication, (req, res) => {
  return knex('users').where({id: parseInt(req.user.id)}).first()
  .then((user) => {
    let result = Object.assign({}, user);
    delete result.password;
    res.status(200).json({data: result});
  })
  .catch((err) => {
    res.status(500).json({
      error: err,
      message: 'An error ocurred while getting the current user.'
    });
  });
});

module.exports = router;
