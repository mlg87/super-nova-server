const knex = require('../db/connection');

module.exports = {
  getAllWithItemType: (item_type_id) => {
    return knex.raw(
      `SELECT
      sizes.size,
      sizes.id,
      i.id as item_type_id
      FROM item_types AS i
      INNER JOIN sizes ON i.size_type_id = sizes.size_type_id
      WHERE i.id = ?`,
      [item_type_id]
    ).then((result) => {
      return result.rows;
    });
  }
};
