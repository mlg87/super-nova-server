const moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const knex = require('../db/connection');

const authHelpers = {

  encodeToken(user) {
    const playload = {
      exp: moment().add(14, 'days').unix(),
      iat: moment().unix(),
      sub: user.id,
      username: user.username
    };
    return jwt.sign(playload, process.env.TOKEN_SECRET);
  },

  decodeToken(token, cb) {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    const now = moment().unix();
    if (now > payload.exp) cb('Token has expired.');
    else cb(null, payload);
  },

  comparePass(userpass, dbpass) {
    bcrypt.compareSync(userpass, dbpass);
  },

  checkAuthentication(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
      return res.status(400).json({
        message: 'Please log in'
      });
    }
    // decode the token
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    authHelpers.decodeToken(token, (err, payload) => {
      if (err) {
        return res.status(401).json({
          message: 'Token has expired'
        });
      } else {
        // check if the user still exists in the db
        return knex('users').where({id: parseInt(payload.sub)}).first()
        .then((user) => {
          req.user = {id: user.id};
          next();
        })
        .catch((err) => {
          res.status(500).json({
            message: 'error'
          });
        });
      }
    });
  },

  ensureCorrectUser(req,res,next) {
    if (+req.params.id !== req.user.id) {
      return res.json({status: 401, message: 'Access Denied'});
    } else {
      return next();
    }
  }
};

module.exports = authHelpers;
