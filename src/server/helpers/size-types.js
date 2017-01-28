
const knex = require('../db/connection');

module.exports = {

  getAll: () => {
    return knex.select().from('size_types');
  },

  addOne: (name) => {
    return knex('size_types')
    .returning('id')
    .insert({name});
  },

  editOne: (id, newName) => {
    return knex('size_types')
      .where('id', id)
      .update({name: newName});
  },

  deleteOne: (id) => {
    return knex('size_types')
      .where('id', id)
      .del();
  }
};
