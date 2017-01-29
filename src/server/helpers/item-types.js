const knex = require('../db/connection')

module.exports = {

  getAll: () => {
    return knex.select().from('item_types');
  }

}
