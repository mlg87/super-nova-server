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

const sizes =
  require('../../src/server/helpers/sizes');

const table = 'sizes';

// we will need from the DB:
//   item_type that has a size type that has sizes
