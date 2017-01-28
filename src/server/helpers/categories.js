
const knex = require('../db/connection');

module.exports = {

  getAll: () => {
    return knex.select().from('categories');
  },

  addOne: (name) => {
    return knex('categories')
    .returning('id')
    .insert({name});
  },

  editOne: (id, newName) => {
    return knex('categories')
      .where('id', id)
      .update({name: newName});
  },

  deleteOne: (id) => {
    return knex('categories')
      .where('id', id)
      .del();
  }
};
