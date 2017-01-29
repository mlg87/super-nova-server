/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

const knex = require('../../src/server/db/connection');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const should = chai.should();
const expect = chai.expect;
const categories =
  require('../../src/server/helpers/categories');
const categoriesFixture =
  require('../fixtures/categories');

chai.use(chaiAsPromised);

const tests = () => {
  describe('categories helpers', () => {

    describe('getAll', () => {

      before(() => {
        return knex('categories').del()
        .then((result) => {
          return knex('categories')
          .insert(categoriesFixture)
          .should.be.fulfilled;
        });
      });

      it('should get an array of categories', () => {
        return categories.getAll()
        .should.eventually.have.length(3);
      });
    });

    describe('addOne', () => {
      before((done) => {
        knex('categories').del()
        .then((result) => {
          done();
        });
      });

      it('should create a category', () => {
        return categories.addOne('Test')
        .should.be.fulfilled
        .then((res) => {
          return knex('categories').select().where({id: res[0]});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('Test');
        });
      });

      it('it should not allow duplicate names', () => {
        return categories.addOne('Test')
        .should.be.rejected
        .then((err) => {
          expect(err.detail).to.equal('Key (name)=(Test) already exists.');
        });
      });

    });

    describe('editOne', () => {
      let id;

      beforeEach(() => {
        return knex('categories').del()
        .then((result) => {
          return knex('categories')
          .returning('id')
          .insert([{name: 'Test'}]);
        })
        .then((res) => {
          // insert is successful it will return an array of ids
          res.should.be.a.array;
          id = res[0];
        });
      });

      it('should edit a category', () => {
        return categories.editOne(id, 'New Name')
        .then(() => {
          return knex('categories').select().where({id: id});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('New Name');
        });
      });

      it('it should not allow duplicate names', () => {
        const duplicateName = 'Helmets';

        return knex('categories').insert([{name: duplicateName}])
        .then(() => {
          return categories.editOne(id, duplicateName);
        })
        .should.be.rejected
        .then((err) => {
          err.detail
          .should.equal(`Key (name)=(${duplicateName}) already exists.`);
        });
      });

    });

  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
