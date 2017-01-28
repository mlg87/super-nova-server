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

const categories = require(
  '../../src/server/helpers/categories');

const categoriesFixture = [
  {name: 'Boats'},
  {name: 'Camping'},
  {name: 'Climbing'}
];

const tests = () => {
  describe('categories helpers', () => {

    describe('errors', () => {
    });

    describe('getAll', () => {

      before((done) => {
        knex('categories').del()
        .then((result) => {
          knex('categories')
          .insert(categoriesFixture).then(() => {
            done();
          });
        });
      });

      it('should get an array of categories', (done) => {
        let getAllPromise = categories.getAll();
        getAllPromise.should.eventually.be.a.array;
        getAllPromise.should.eventually.have.length(3);
        done();
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
        .then((res) => {
          return knex('categories').select().where({id: res[0]});
        })
        .then((result) => {
          expect(result[0]).to.have.property('id');
          expect(result[0]).to.have.property('created_at');
          expect(result[0].name).to.equal('Test');
          done();
        });
      });

      it('it should not allow duplicate names', (done) => {
        addOnePromise = categories.addOne('Test');
        addOnePromise.should.be.rejected
        .then((err) => {
          expect(err.detail).to.equal('Key (name)=(Test) already exists.');
          done();
        });
      });

    });

    xdescribe('editOne', () => {
      let id;
      beforeEach((done) => {
        knex('categories').del()
        .then((result) => {
          knex('categories')
          .returning('id')
          .insert([{name: 'Test'}])
          .then((res) => {
            // insert is successful it will return an array of ids
            expect(res).to.be.a.array;
            id = res[0];
            done();
          })
          .catch((err) => {
            // this will throw an error if we get in here
            expect(err).to.be.undefined;
            done();
          });
        });

      });

      it('should edit a category', (done) => {
        categories.editOne(id, 'New Name')
        .then(() => {
          return knex('categories').select().where({id: id});
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
        knex('categories').insert([{name: duplicateName}])
        .then(() => {
          categories.editOne(id, duplicateName)
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
