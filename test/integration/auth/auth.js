const register = require('./register');

module.exports = () => {
  describe('auth routes', () => {
    register();
  });
};
