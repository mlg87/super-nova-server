const moment = require('moment');
const jwt = require('jsonwebtoken');

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

  checkAuthentication(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.json({status: 401, message: 'Access denied.'});
    } else {
      return next();
    }
  },

  // use this to send the user object back in the response
  currentUser(req, res, next) {
    // if user is authenticated (passport method returns true when serialized)
    if (req.isAuthenticated()) {
      // this is available in the view for all requests, deserializing FTW
      res.locals.currentUser = req.user;
      return next();
    } else {
      return next();
    }
  },

  preventLoginSignup(req, res, next) {
    if (req.user) {
      return res.json({status: 406, message: 'Already logged in.'});
    } else {
      return next();
    }
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
