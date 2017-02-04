/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

const knex = require('../../src/server/db/connection');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const should = chai.should();
const expect = chai.expect;
const crud =
  require('../../src/server/helpers/basic-crud');
const fixtures =
  require('../fixtures/index');

chai.use(chaiAsPromised);

const tables = ['size_types', 'categories', 'brands'];

const tests = () => {
  tables.forEach((table) => {
    describe(`${table} helpers`, () => {

      describe('getAll', () => {

        before(() => {
          return knex(table).del()
          .then((result) => {
            return knex(table)
            .insert(fixtures[table])
            .should.be.fulfilled;
          });
        });

        it(`should get an array of ${table}`, () => {
          return crud.getAll(table)
          .should.eventually.have.length(3);
        });
      });

      describe('addOne', () => {
        before((done) => {
          knex(table).del()
          .then((result) => {
            done();
          });
        });

        it(`should create a row in ${table}`, () => {
          let name = 'Test';
          return crud.addOne(table, {name})
          .should.be.fulfilled
          .then((res) => {
            return knex(table).select().where({id: res[0]});
          })
          .then((result) => {
            expect(result[0]).to.have.property('id');
            expect(result[0]).to.have.property('created_at');
            expect(result[0].name).to.equal('Test');
          });
        });

        it('it should not allow duplicate names', () => {
          return crud.addOne(table, {name: 'Test'})
          .should.be.rejected
          .then((err) => {
            expect(err.detail).to.equal('Key (name)=(Test) already exists.');
          });
        });

      });

      describe('editOne', () => {
        let id;

        beforeEach(() => {
          return knex(table).del()
          .then((result) => {
            return knex(table)
            .returning('id')
            .insert([{name: 'Test'}]);
          })
          .then((res) => {
            // insert is successful it will return an array of ids
            res.should.be.a.array;
            id = res[0];
          });
        });

        it(`should edit a row in ${table}`, () => {
          return crud.editOne(table, id, {name: 'New Name'})
          .then(() => {
            return knex(table)
            .select()
            .where('id', id);
          })
          .then((result) => {
            expect(result[0]).to.have.property('id');
            expect(result[0]).to.have.property('created_at');
            expect(result[0].name).to.equal('New Name');
          });
        });

        it('it should not allow duplicate names', () => {
          const duplicateName = 'Helmets';

          return knex(table).insert([{name: duplicateName}])
          .then(() => {
            return crud.editOne(table, id, {name: duplicateName});
          })
          .should.be.rejected
          .then((err) => {
            err.detail
            .should.equal(`Key (name)=(${duplicateName}) already exists.`);
          });
        });

      });

      describe('deleteOne', () => {

        let rowFromDb;

        before(() => {
          return knex(table).select().first()
          .should.be.fulfilled
          .then((result) => {
            rowFromDb = result;
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

        it(`should remove a row from ${table}`, () => {
          return crud.deleteOne(table, rowFromDb.id)
          .should.be.fulfilled
          .then(() => {
            return knex(table).select().where('id', rowFromDb.id)
            .should.eventually.be.empty;
          });
        });

      });

    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
