const knex = require('../src/server/db/connection');

module.exports = {
  seedInventoryReturningIdAndName: (tables, fixtures) => {
    const promises = tables.map((table) => {
      return knex(table)
        .returning(['id', 'name'])
        .insert(fixtures[table]);
    });
    return Promise.all(promises)
  },

  clearTables: (tables) => {
    const promises = tables.map((table) => {
      return knex(table).del();
    });
    return Promise.all(promises);
  }
}
