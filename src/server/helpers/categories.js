
const knex = require('../db/connection');

module.exports = {

  getAll: () => {
    return knex.select().from('categories');
  },

  addOne: (name) => {
    return knex('categories').insert({name});
  }

}
