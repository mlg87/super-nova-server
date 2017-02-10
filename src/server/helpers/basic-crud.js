const knex = require('../db/connection');

module.exports = {

  getAll: (table) => {
    return knex
    .select()
    .from(table);
  },

  addOne: (table, newDoc) => {
    return knex(table)
    .returning('id')
    .insert(newDoc);
  },

  editOne: (table, id, editedFields) => {
    return knex(table)
    .update(editedFields)
    .where('id', id);
  },

  deleteOne: (table, id) => {
    if (!id) {
      return Promise.reject('no id supplied');
    }
    return knex(table)
    .del()
    .where('id', id);
  }

};
