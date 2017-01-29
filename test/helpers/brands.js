/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

const knex = require('../../src/server/db/connection');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const should = chai.should();
const expect = chai.expect;
const brands =
  require('../../src/server/helpers/brands');
const brandsFixture =
  require('../fixtures/brands');

chai.use(chaiAsPromised);

const tests = () => {
  describe('brands helpers', () => {

    describe('getAll', () => {

      before(() => {
        return knex('brands').del()
        .then((result) => {
          return knex('brands')
          .insert(brandsFixture)
          .should.be.fulfilled;
        });
      });

      it('should get an array of brands', () => {
        return brands.getAll()
        .should.eventually.have.length(3);
      });
    });

    describe('addOne', () => {
      before((done) => {
        knex('brands').del()
        .then((result) => {
          done();
        });
      });

      it('should create a brand', () => {
        return brands.addOne('Test')
        .should.be.fulfilled
        .then((res) => {
          return knex('brands').select().where({id: res[0]});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('Test');
        });
      });

      it('it should not allow duplicate names', () => {
        return brands.addOne('Test')
        .should.be.rejected
        .then((err) => {
          expect(err.detail).to.equal('Key (name)=(Test) already exists.');
        });
      });

    });

    describe('editOne', () => {
      let id;

      beforeEach(() => {
        return knex('brands').del()
        .then((result) => {
          return knex('brands')
          .returning('id')
          .insert([{name: 'Test'}]);
        })
        .then((res) => {
          // insert is successful it will return an array of ids
          res.should.be.a.array;
          id = res[0];
        });
      });

      it('should edit a brand', () => {
        return brands.editOne(id, 'New Name')
        .then(() => {
          return knex('brands').select().where({id: id});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('New Name');
        });
      });

      it('it should not allow duplicate names', () => {
        const duplicateName = 'Helmets';

        return knex('brands').insert([{name: duplicateName}])
        .then(() => {
          return brands.editOne(id, duplicateName);
        })
        .should.be.rejected
        .then((err) => {
          err.detail
          .should.equal(`Key (name)=(${duplicateName}) already exists.`);
        });
      });

    });

    describe('deleteOne', () => {

      let itemFromDb;

      before(() => {
        return knex('brands').select().first()
        .should.be.fulfilled
        .then((result) => {
          itemFromDb = result;
        });
      });

      it('should not delete if no id is passed', () => {
        return brands.deleteOne()
        .should.be.rejectedWith('no id supplied');
      });

      it('should not delete if the argument is not a number', () => {
        return brands.deleteOne(['id'])
        .should.be.rejected;
      });

      it('should remove an item_type', () => {
        return brands.deleteOne(itemFromDb.id)
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
