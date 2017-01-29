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

const sizeTypes = require(
  '../../src/server/helpers/size-types');

const sizeTypesFixture =
  require('../fixtures/size-types');

const tests = () => {
  describe('sizeTypes helpers', () => {

    describe('errors', () => {
    });

    describe('getAll', () => {

      before((done) => {
        knex('size_types').del()
        .then((result) => {
          knex('size_types')
          .insert(sizeTypesFixture).then(() => {
            done();
          });
        });
      });

      it('should get an array of sizeTypes', (done) => {
        let getAllPromise = sizeTypes.getAll();
        getAllPromise.should.eventually.be.a.array;
        getAllPromise.should.eventually.have.length(3);
        done();
      });
    });

    describe('addOne', () => {
      before((done) => {
        knex('size_types').del()
        .then((result) => {
          done();
        });
      });

      it('should create a category', (done) => {
        sizeTypes.addOne('Test')
        .then((res) => {
          return knex('size_types').select().where({id: res[0]});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('Test');
          done();
        });
      });

      it('it should not allow duplicate names', (done) => {
        addOnePromise = sizeTypes.addOne('Test');
        addOnePromise.should.be.rejected
        .then((err) => {
          expect(err.detail).to.equal('Key (name)=(Test) already exists.');
          done();
        });
      });

    });

    describe('editOne', () => {
      let id;
      beforeEach((done) => {
        knex('size_types').del()
        .then((result) => {
          knex('size_types')
          .returning('id')
          .insert([{name: 'Test'}])
          .should.be.fulfilled
          .then((res) => {
            // insert is successful it will return an array of ids
            expect(res).to.be.a.array;
            id = res[0];
            done();
          });
        });
      });

      it('should edit a category', (done) => {
        sizeTypes.editOne(id, 'New Name')
        .then(() => {
          return knex('size_types').select().where({id: id});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('New Name');
          done();
        });
      });

      it('it should not allow duplicate names', (done) => {
        const duplicateName = 'Helmets';
        knex('size_types').insert([{name: duplicateName}])
        .then(() => {
          sizeTypes.editOne(id, duplicateName)
          .should.be.rejected
          .then((err) => {
            expect(err.detail)
            .to.equal(`Key (name)=(${duplicateName}) already exists.`);
            done();
          });
        });
      });
    });

  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
