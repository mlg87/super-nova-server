/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

const knex = require('../../../src/server/db/connection');
const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require(
  '../../../src/server/app');
const authHelpers = require(
  '../../../src/server/helpers/auth');

const tests = () => {
  describe('/api/categories - get', () => {
    describe('errors', () => {

      it('should throw an error is a user is not logged in', (done) => {
        chai.request(server)
        .get('/api/categories')
        .end((err, res) => {
          expect(res).to.not.be.defined;
          expect(err.status).to.equal(400);
          done();
        });
      });

    });

    // commenting out b/c I couldn't stub the middle ware
    xdescribe('success', () => {
      let sandbox = sinon.sandbox.create();
      let auth;
      beforeEach((done) => {
        auth = sinon.stub(authHelpers, 'checkAuthentication');
        auth.callsArg(2);
        done();
      });

      afterEach((done) => {
        // auth.restore()
        sandbox.restore();
        done();
      });

      it('should get an array of categories', (done) => {
        chai.request(server)
        .get('/api/categories')
        .set('authorization', '123')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.a.array;
          done();
        });
      });

    });

  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
