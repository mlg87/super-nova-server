const authRoutes = require('./routes/auth/auth');
const authHelpers = require('./helpers/auth');

const testRunner = Promise.resolve();

testRunner.then(() => {

  authRoutes();
  authHelpers();

});
