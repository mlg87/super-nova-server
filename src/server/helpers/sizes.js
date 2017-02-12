const knex = require('../db/connection');

module.exports = {
  getWithItemType: (item_type_id) => {
    return knex.raw(
      `SELECT id FROM item_types AS i
      INNER JOIN sizes ON i.size_type_id = sizes.size_type_id
      WHERE i.id = ?`,
      [item_type_id]
    ).then((result) => {
      return result.rows;
    });
  }
};
