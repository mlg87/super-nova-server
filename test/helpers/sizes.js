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

const testUtils = require('../testUtils');
const fixtures = require('../fixtures/index');
const sizes =
  require('../../src/server/helpers/sizes');

const table = 'sizes';

const tests = () => {
  describe('sizes helpers', () => {

    let modelsInDb;
    let categoriesInDb;
    let sizeTypesInDb;
    let itemTypesInDb;
    let sizesInDb;
    let brandsInDb;
    let itemsWithIds;
    let modelsWithIds;
    let size;

    before(() => {
      let tables = [
        'models',
        'brands',
        'item_types',
        'sizes',
        'size_types',
        'categories'
      ];
      // clear out tables
      return testUtils.clearTables(tables)
      .should.be.fulfilled
      // add rows that we will need ids for FK's
      .then(() => {
        let tables = [
          'categories',
          'size_types',
          'brands'
        ];
        return testUtils.seedInventoryReturningIdAndName(tables, fixtures);
      })
      .should.be.fulfilled
      .then((result) => {
        categoriesInDb = result[0];
        sizeTypesInDb = result[1];
        brandsInDb = result[2];
        return testUtils.createItemTypes(
          fixtures.item_types,
          categoriesInDb,
          sizeTypesInDb
        );
      })
      .should.be.fulfilled
      .then((itemTypes) => {
        itemTypesInDb = itemTypes;
      })
      .then(() => {
        return testUtils.createSizes(
          fixtures.sizes,
          sizeTypesInDb
        );
      })
      .should.be.fulfilled
      .then((sizes) => {
        size = sizes[0];
      });
    });

    after(() => {
      let tables = [
        'models',
        'brands',
        'item_types',
        'sizes',
        'size_types',
        'categories'
      ];
      // clear out tables
      return testUtils.clearTables(tables)
      .should.be.fulfilled;
    });

    describe('getAllWithItemType', () => {
      it('should get all sizes with item-type', () => {
        let id = itemTypesInDb[0].id;
        return sizes.getAllWithItemType(id)
        .should.be.fulfilled.and
        .should.eventually.have.length(3);
      });
    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
