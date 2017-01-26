/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

const knex = require('../../src/server/db/connection');
const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();
const expect = chai.expect;

const categories = require(
  '../../src/server/helpers/categories');

const tests = () => {
  describe('categories helpers', () => {

    describe('errors', () => {
    });

    describe('getAll', () => {
      it('should get an array of categories', (done) => {
        categories.getAll()
        .then((result) => {
          expect(result).to.be.a.array;
          done();
        });
      });
    });

    describe('addOne', () => {
      before((done) => {
        knex('categories').del()
        .then((result) => {
          done();
        });
      });

      it('should create a category', (done) => {
        categories.addOne('Test')
        .then(() => {
          return knex('categories').select().where({name: 'Test'});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('Test');
          done();
        })
      });

      it('it should not allow duplicate names', (done) => {
        categories.addOne('Test')
        .then((result) => {
          console.log('result', result);
          expect(result).to.equal('This should not be called');
          done()
        })
        .catch((err) => {
          expect(err.detail).to.equal('Key (name)=(Test) already exists.')
          done()
        });
      });

    });
  });
}

if (process.env.NODE_ENV === 'test') {
  module.exports = tests
}
