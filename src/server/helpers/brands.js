
const knex = require('../db/connection');
const tableName = 'brands';

module.exports = {

  getAll: () => {
    return knex.select().from(tableName);
  },

  addOne: (name) => {
    return knex(tableName)
    .returning('id')
    .insert({name});
  },

  editOne: (id, newName) => {
    return knex(tableName)
      .where('id', id)
      .update({name: newName});
  },

  deleteOne: (id) => {
    if (!id) {
      return Promise.reject('no id supplied');
    }
    return knex(tableName)
      .where('id', id)
      .del();
  }
};
