const authRoutes = require('./routes/auth/auth');
const categoryRoutes = require('./routes/categories/categories');
const authHelpers = require('./helpers/auth');
const categoriesHelpers = require('./helpers/categories');
const sizeTypesHelpers = require('./helpers/size-types');

const testRunner = Promise.resolve();

testRunner.then(() => {

  categoryRoutes();
  authRoutes();
  authHelpers();
  categoriesHelpers();
  sizeTypesHelpers();

});
