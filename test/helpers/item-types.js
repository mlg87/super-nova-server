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

const {
  categoriesFixture,
  sizeTypesFixture,
  itemTypesFixture
} = require('../fixtures/index');

const tests = () => {
  describe('itemTypes helpers', () => {

    let categoriesInDb;
    let sizeTypesInDb;
    let itemsWithIds;
    let itemType;

    before(() => {
      return Promise.all([
        knex('item_types').del(),
        knex('categories').del(),
        knex('size_types').del()
      ])
      .should.be.fulfilled
      .then(() => {
        return Promise.all([
          knex('categories')
            .returning(['id', 'name'])
            .insert(categoriesFixture),
          knex('size_types')
            .returning(['id', 'name'])
            .insert(sizeTypesFixture)
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
        itemType = {
          name: 'Test Item Type',
          category_id: categoriesInDb[0].id,
          size_type_id: sizeTypesInDb[0].id,
          description: 'great description'
        };
        return knex('item_types').insert(itemsWithIds)
        .should.be.fulfilled;
      });
    });

    after(() => {
      return Promise.all([
        knex('item_types').del(),
        knex('categories').del(),
        knex('size_types').del()
      ])
      .should.be.fulfilled;
    });

    describe('getAll itemTypes', () => {
      it('should get all item-types', () => {
        return itemTypes.getAll()
        .should.be.fulfilled.and
        .should.eventually.have.length(3);
      });
    });

    describe('addOne itemType', () => {

      it('should not allow a nonexistant category id be inserted', () => {
        const badCategoryId = Object.assign({}, itemType);
        badCategoryId.category_id = 1000;
        return itemTypes.addOne(badCategoryId)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal('Key (category_id)=(1000) is not present in table "categories".');
        });
      });

      it('should not allow a nonexistant size_type id be inserted', () => {
        const badSizeTypeId = Object.assign({}, itemType);
        badSizeTypeId.size_type_id = 1000;
        return itemTypes.addOne(badSizeTypeId)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal('Key (size_type_id)=(1000) is not present in table "size_types".');
        });
      });

      it('should add one item-type', () => {
        return itemTypes.addOne(itemType)
        .should.be.fulfilled
        .then(() => {
          return knex('item_types')
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
        return itemTypes.addOne(itemType)
        .should.be.rejected
        .then((err) => {
          err.detail.should
          .equal('Key (name)=(Test Item Type) already exists.');
        });
      });
    });

    describe('editOne', () => {

      let itemFromDb;

      before(() => {
        return knex('item_types').select().first()
        .should.be.fulfilled
        .then((result) => {
          itemFromDb = result;
        });
      });

      it('should edit an item_type in the db', () => {
        itemFromDb.name = 'New Name';
        return itemTypes.editOne(itemFromDb)
        .should.be.fulfilled
        .then(() => {
          return knex('item_types').select().where('id', itemFromDb.id).first();
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
        return knex('item_types').select().first()
        .should.be.fulfilled
        .then((result) => {
          itemFromDb = result;
        });
      });

      it('should not delete if no id is passed', () => {
        return itemTypes.deleteOne()
        .should.be.rejectedWith('no id supplied');
      });

      it('should not delete if the argument is not a number', () => {
        return itemTypes.deleteOne(['id'])
        .should.be.rejected;
      });

      it('should remove an item_type', () => {
        return itemTypes.deleteOne(itemFromDb.id)
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
