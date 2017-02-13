module.exports = {
  auth: require('./auth'),
  inventory: [require('./inventory'), require('./basic-crud')('inventory')],
  customers: require('./customers'),
  users: require('./users'),
  reservations: require('./reservations'),
  sizes: require('./sizes'),
  categories: require('./basic-crud')('categories'),
  brands: require('./basic-crud')('brands'),
  size_types: require('./basic-crud')('size_types'),
  item_types: require('./basic-crud')('item_types'),
  models: require('./basic-crud')('models')
};
