const knex = require('../src/server/db/connection');

module.exports = {
  seedInventoryReturningIdAndName: (tables, fixtures) => {
    const promises = tables.map((table) => {
      return knex(table)
        .returning(['id', 'name'])
        .insert(fixtures[table]);
    });
    return Promise.all(promises);
  },

  clearTables: (tables) => {
    const promises = tables.map((table) => {
      return knex(table).del();
    });
    return Promise.all(promises);
  },

  createItemTypes: (
    itemTypesFixture,
    categoriesInDb,
    sizeTypesInDb
    ) => {
    const itemsTypesWithIds =
    itemTypesFixture.map((item, i) => {
      let ids = {
        category_id: categoriesInDb[i].id,
        size_type_id: sizeTypesInDb[i].id
      };
      return Object.assign(item, ids);
    });
    return knex('item_types')
    .insert(itemsTypesWithIds)
    .returning(['id', 'name']);
  },

  createModels: (
    modelsFixture,
    itemTypesInDb,
    brandsInDb
    ) => {
    const modelsWithIds =
    modelsFixture.map((model, i) => {
      let ids = {
        item_type_id: itemTypesInDb[i].id,
        brand_id: brandsInDb[i].id
      };
      return Object.assign(model, ids);
    });
    return knex('models')
    .returning(['brand_id', 'item_type_id'])
    .insert(modelsWithIds);
  },

  createSizes: (
    sizesFixture,
    sizeTypesInDb
  ) => {
    const sizesWithIds =
    sizesFixture.reduce((arr, sizes, i) => {
      let id = {size_type_id: sizeTypesInDb[i].id};
      let chunk = sizes.map((size) => {
        return Object.assign(size, id);
      });
      return [...arr, ...chunk];
    }, []);
    return knex('sizes')
    .returning('*')
    .insert(sizesWithIds);
  }

};
