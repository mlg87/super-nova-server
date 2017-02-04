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

const sizeTypes =
  require('../../src/server/helpers/size-types');

const sizeTypesFixture =
  require('../fixtures/size-types');

const tests = () => {
  describe('sizeTypes helpers', () => {

    describe('getAll', () => {

      before(() => {
        return knex('size_types').del()
        .then(() => {
          return knex('size_types')
          .insert(sizeTypesFixture)
          .should.be.fulfilled;
        });
      });

      it('should get an array of size_types', () => {
        return sizeTypes.getAll()
        .should.eventually.have.length(3);
      });
    });

    describe('addOne', () => {
      before(() => {
        return knex('size_types').del()
        .should.be.fulfilled;
      });

      it('should create a size_type', () => {
        return sizeTypes.addOne('Test')
        .should.be.fulfilled
        .then((res) => {
          return knex('size_types').select().where({id: res[0]});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('Test');
        });
      });

      it('it should not allow duplicate names', () => {
        return sizeTypes.addOne('Test')
        .should.be.rejected
        .then((err) => {
          expect(err.detail).to.equal('Key (name)=(Test) already exists.');
        });
      });

    });

    describe('editOne', () => {
      let id;

      beforeEach(() => {
        return knex('size_types').del()
        .then((result) => {
          return knex('size_types')
          .returning('id')
          .insert([{name: 'Test'}]);
        })
        .then((res) => {
          // insert is successful it will return an array of ids
          res.should.be.a.array;
          id = res[0];
        });
      });

      it('should edit a size_type', () => {
        return sizeTypes.editOne(id, 'New Name')
        .then(() => {
          return knex('size_types').select().where({id: id});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('New Name');
        });
      });

      it('it should not allow duplicate names', () => {
        const duplicateName = 'Helmets';

        return knex('size_types').insert([{name: duplicateName}])
        .then(() => {
          return sizeTypes.editOne(id, duplicateName);
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
