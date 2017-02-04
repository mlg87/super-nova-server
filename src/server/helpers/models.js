
const knex = require('../db/connection');
const tableName = 'models';

module.exports = {

  getAll: () => {
    return knex.select().from(tableName);
  },

  addOne: (model) => {
    return knex(tableName)
    .returning('id')
    .insert(model);
  },

  editOne: (id, model) => {
    return knex(tableName)
      .where('id', id)
      .update(model);
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
