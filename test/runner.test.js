const authRoutes = require('./routes/auth/auth');
const categoryRoutes = require('./routes/categories/categories');
const authHelpers = require('./helpers/auth');

const testRunner = Promise.resolve();

testRunner.then(() => {

  categoryRoutes();
  authRoutes();
  authHelpers();

});
