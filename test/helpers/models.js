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
const crud =
  require('../../src/server/helpers/basic-crud');

const table = 'models';

const tests = () => {
  describe('models helpers', () => {

    let modelsInDb;
    let categoriesInDb;
    let sizeTypesInDb;
    let brandsInDb;
    let itemsWithIds;
    let modelsWithIds;
    let model;

    before(() => {
      let tables = [
        'models',
        'brands',
        'item_types',
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
      // make item types and insert into the DB
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
      // make models and insert into the DB
      .then((itemTypesInDb) => {
        return testUtils.createModels(
          fixtures.models,
          itemTypesInDb,
          brandsInDb
        );
      })
      .should.be.fulfilled
      // grab a model for use in the tests
      .then((models) => {
        model = models[0];
        model.name = 'Test Model';
      });
    });

    after(() => {
      let tables = [
        'models',
        'brands',
        'item_types',
        'size_types',
        'categories'
      ];
      // clear out tables
      return testUtils.clearTables(tables)
      .should.be.fulfilled;
    });

    describe('getAll models', () => {
      it('should get all item-types', () => {
        return crud.getAll(table)
        .should.be.fulfilled.and
        .should.eventually.have.length(3);
      });
    });

    describe('addOne model', () => {

      it('should not allow a nonexistant brand id be inserted', () => {
        const badBrandId = Object.assign({}, model);
        badBrandId.brand_id = 1000;
        return crud.addOne(table, badBrandId)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal('Key (brand_id)=(1000) is not present in table "brands".');
        });
      });

      it('should not allow a nonexistant item_type id be inserted', () => {
        const badItemTypeId = Object.assign({}, model);
        badItemTypeId.item_type_id = 1000;
        return crud.addOne(table, badItemTypeId)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal('Key (item_type_id)=(1000) is not present in table "item_types".');
        });
      });

      it('should add one model', () => {
        return crud.addOne(table, model)
        .should.be.fulfilled
        .then(() => {
          return knex(table)
          .select(Object.keys(model))
          .where('name', model.name)
          .first();
        })
        .should.be.fulfilled
        .then((itemFromDb) => {
          itemFromDb.should.deep.equal(model);
        });
      });

      it('should not allow a duplicate name', () => {
        return crud.addOne(table, model)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal(`Key (name, brand_id)=(${model.name}, ${model.brand_id}) already exists.`);
        });
      });
    });

    describe('editOne', () => {

      let itemFromDb;
      let id;

      before(() => {
        return knex(table).select().first()
        .should.be.fulfilled
        .then((result) => {
          id = result.id;
          delete result.id;
          itemFromDb = result;
        });
      });

      it('should edit a model in the db', () => {
        itemFromDb.name = 'New Name';
        return crud.editOne(table, id, itemFromDb)
        .should.be.fulfilled
        .then(() => {
          return knex(table).select().where('id', id).first();
        })
        .then((item) => {
          item.created_at.should.deep.equal(itemFromDb.created_at);
          item.name.should.equal('New Name');
        });
      });

    });

    describe('deleteOne', () => {

      let itemFromDb;

      before(() => {
        return knex(table).select().first()
        .should.be.fulfilled
        .then((result) => {
          itemFromDb = result;
        });
      });

      it('should not delete if no id is passed', () => {
        return crud.deleteOne(table)
        .should.be.rejectedWith('no id supplied');
      });

      it('should not delete if the argument is not a number', () => {
        return crud.deleteOne(table, ['id'])
        .should.be.rejected;
      });

      it('should remove a model', () => {
        return crud.deleteOne(table, itemFromDb.id)
        .should.be.fulfilled
        .then(() => {
          return knex('item_type').select().where('id', itemFromDb.id)
          .should.be.rejected;
        });
      });

    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
