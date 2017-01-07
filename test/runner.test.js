const auth = require('./integration/auth/auth');

const testRunner = Promise.resolve()

testRunner.then(() => {

  auth();

});
