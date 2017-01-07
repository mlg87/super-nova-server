const register = require('./register');
const login = require('./login');

module.exports = () => {
  describe('auth routes', () => {
    register();
    login();
  });
};
