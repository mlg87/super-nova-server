const auth = require('./routes/auth/auth');

const testRunner = Promise.resolve();

testRunner.then(() => {

  auth();

});
