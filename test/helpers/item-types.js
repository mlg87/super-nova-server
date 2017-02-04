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

const table = 'item_types';

const {
  categories,
  size_types,
  item_types
} = require('../fixtures/index');

const tests = () => {
  describe('itemTypes helpers', () => {

    let categoriesInDb;
    let sizeTypesInDb;
    let itemsWithIds;
    let itemType;

    before(() => {
      return Promise.all([
        knex(table).del(),
        knex('categories').del(),
        knex('size_types').del()
      ])
      .should.be.fulfilled
      .then(() => {
        return Promise.all([
          knex('categories')
            .returning(['id', 'name'])
            .insert(categories),
          knex('size_types')
            .returning(['id', 'name'])
            .insert(size_types)
        ]);
      })
      .should.be.fulfilled
      .then((result) => {
        categoriesInDb = result[0];
        sizeTypesInDb = result[1];
        itemsWithIds = item_types.map((item, i) => {
          let ids = {
            category_id: categoriesInDb[i].id,
            size_type_id: sizeTypesInDb[i].id
          };
          return Object.assign(item, ids);
        });
      })
      .then(() => {
        // set this here to use in later tests
        itemType = {
          name: 'Test Item Type',
          category_id: categoriesInDb[0].id,
          size_type_id: sizeTypesInDb[0].id,
          description: 'great description'
        };
        return knex(table).insert(itemsWithIds)
        .should.be.fulfilled;
      });
    });

    after(() => {
      return Promise.all([
        knex(table).del(),
        knex('categories').del(),
        knex('size_types').del()
      ])
      .should.be.fulfilled;
    });

    describe('getAll itemTypes', () => {
      it('should get all item-types', () => {
        return crud.getAll(table)
        .should.be.fulfilled.and
        .should.eventually.have.length(3);
      });
    });

    describe('addOne itemType', () => {

      it('should not allow a nonexistant category id be inserted', () => {
        const badCategoryId = Object.assign({}, itemType);
        badCategoryId.category_id = 1000;
        return crud.addOne(table, badCategoryId)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal('Key (category_id)=(1000) is not present in table "categories".');
        });
      });

      it('should not allow a nonexistant size_type id be inserted', () => {
        const badSizeTypeId = Object.assign({}, itemType);
        badSizeTypeId.size_type_id = 1000;
        return crud.addOne(table, badSizeTypeId)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal('Key (size_type_id)=(1000) is not present in table "size_types".');
        });
      });

      it('should add one item-type', () => {
        return crud.addOne(table, itemType)
        .should.be.fulfilled
        .then(() => {
          return knex(table)
          .select(Object.keys(itemType))
          .where('name', itemType.name)
          .first();
        })
        .should.be.fulfilled
        .then((itemFromDb) => {
          itemFromDb.should.deep.equal(itemType);
        });
      });

      it('should not allow a duplicate name', () => {
        return crud.addOne(table, itemType)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal('Key (name)=(Test Item Type) already exists.');
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

      it('should edit an item_type in the db', () => {
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

      it('should remove an item_type', () => {
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
