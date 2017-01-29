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

const itemTypes = require(
  '../../src/server/helpers/item-types');

const tests = () => {
  describe('itemTypes helpers', () => {

    before(() => {
      return knex('item_types').del()
      .should.be.fulfilled;
    })

    describe('errors', () => {
    });

    describe('getAll itemTypes', () => {

      it('should get all item-types', () => {
        return itemTypes.getAll()
        .should.be.fulfilled.and
        .should.eventually.have.length(3);
      });

    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
};
