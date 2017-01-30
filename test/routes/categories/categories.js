const getCategories = require('./getCategories');

module.exports = () => {
  describe('category routes', () => {
    getCategories();
  });
};
