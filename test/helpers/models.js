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

const crud =
  require('../../src/server/helpers/basic-crud');

const table = 'models';

const {
  categories,
  size_types,
  item_types,
  brands,
  models
} = require('../fixtures/index');

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

      return Promise.all([
        knex('models').del(),
        knex('brands').del(),
        knex('item_types').del(),
        knex('size_types').del(),
        knex('categories').del()
      ])
      .should.be.fulfilled
      .then(() => {
        return Promise.all([
          knex('categories')
            .returning(['id', 'name'])
            .insert(categories),
          knex('size_types')
            .returning(['id', 'name'])
            .insert(size_types),
          knex('brands')
            .returning(['id', 'name'])
            .insert(brands)
        ]);
      })
      .should.be.fulfilled
      .then((result) => {
        categoriesInDb = result[0];
        sizeTypesInDb = result[1];
        brandsInDb = result[2];
        itemsWithIds = item_types.map((item, i) => {
          let ids = {
            category_id: categoriesInDb[i].id,
            size_type_id: sizeTypesInDb[i].id
          };
          return Object.assign(item, ids);
        });
      })
      .then(() => {
        return knex('item_types').insert(itemsWithIds)
        .returning(['id', 'name'])
        .should.be.fulfilled;
      })
      .then((itemTypes) => {
        modelsWithIds = models.map((model, i) => {
          let ids = {
            item_type_id: itemTypes[i].id,
            brand_id: brandsInDb[i].id
          };
          return Object.assign(model, ids);
        });
        return knex('models')
        .returning(['brand_id', 'item_type_id'])
        .insert(modelsWithIds);
      })
      .then((models) => {
        model = models[0];
        model.name = 'Test Model';
      });
    });

    after(() => {
      return Promise.all([
        knex('models').del(),
        knex('brands').del(),
        knex('item_types').del(),
        knex('size_types').del(),
        knex('categories').del()
      ])
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
