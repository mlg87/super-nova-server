/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

const knex = require('../../src/server/db/connection');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiAsPromised);

const itemTypes =
  require('../../src/server/helpers/item-types');

const {categoriesFixture, sizeTypesFixture, itemTypesFixture} = require('../fixtures/index');

const tests = () => {
  describe('itemTypes helpers', () => {

    let categoriesInDb;
    let sizeTypesInDb;
    let itemsWithIds;

    beforeEach(() => {
      return Promise.all([
        knex('item_types').del(),
        knex('categories').del(),
        knex('size_types').del()
      ])
      .should.be.fulfilled
      .then(() => {
        return Promise.all([
          knex('categories').returning(['id', 'name']).insert(categoriesFixture),
          knex('size_types').returning(['id', 'name']).insert(sizeTypesFixture)
        ]);
      })
      .should.be.fulfilled
      .then((result) => {
        categoriesInDb = result[0];
        sizeTypesInDb = result[1];
        itemsWithIds = itemTypesFixture.map((item, i) => {
          let ids = {
            category_id: categoriesInDb[i].id,
            size_type_id: sizeTypesInDb[i].id
          };
          return Object.assign(item, ids);
        });
      })
      .then(() => {
        return knex('item_types').insert(itemsWithIds)
        .should.be.fulfilled;
      });
    });

    describe('getAll itemTypes', () => {
      it('should get all item-types', () => {
        return itemTypes.getAll()
        .should.be.fulfilled.and
        .should.eventually.have.length(3);
      });
    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
