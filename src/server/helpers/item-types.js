const knex = require('../db/connection');

const table = 'item_types';
module.exports = {

  getAll: () => {
    return knex.select().from(table);
  },

  // itemTypeObject = {
  //   name,
  //   description, (opt)
  //   category_id,
  //   size_type_id
  // }
  addOne: (itemTypeObject) => {
    return knex(table).insert(itemTypeObject);
  },

  editOne: (itemTypeObject) => {
    return knex(table).update(itemTypeObject).where('id', itemTypeObject.id);
  },

  deleteOne: (id) => {
    if (!id) {
      return Promise.reject('no id supplied');
    }
    return knex(table).del().where('id', id);
  }

};
