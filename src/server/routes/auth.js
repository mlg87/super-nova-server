const express = require('express');
const router = express.Router();
const authHelpers = require('../helpers/auth');
const passwordHelpers = require('../helpers/password');
const knex = require('../db/connection');
const passport = require('passport');

router.post('/register', authHelpers.preventLoginSignup, (req, res, next)  => {
  passwordHelpers.createUser(req)
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

// authenticate users when logging in
// no need for req,res passport does this for us
router.post('/login', (req, res, next) => {
  const username = req.body.user.username;
  const password = req.body.user.password;
  return knex('users').where({username})
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

router.get('/logout', authHelpers.checkAuthentication, (req,res) => {
  // req.logout added by passport - deletes the user from the session cookie
  req.logout();
  res.status(200).json({message: 'Logout succesful.'});
});

// ** helper routes ** //

router.get('/current_user', authHelpers.checkAuthentication, (req,res) => {
  res.json(req.user);
});

router.get('/loginFailed', function (req, res, next) {
  return res.json({status: 401, message: 'Authentication failed.'});
});

module.exports = router;
