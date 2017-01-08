/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

process.env.NODE_ENV = 'test';

const knex = require('../../../src/server/db/connection');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../../src/server/app');

const tests = () => {
  describe('auth/register', () => {

    describe('errors', () => {

      beforeEach((done) => {
        done();
      });

      afterEach((done) => {
        knex('users').del().then(() => {
          done();
        });
      });

      it('should throw error if username is not 6 or more characters', (done) => {
        chai.request(server)
        .post('/auth/register')
        .send({
          user: {
            username: '',
            password: 'pass'
          }
        })
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
      });
    });

    describe('success', () => {
      let response = null;
      let error = null;

      before((done) => {
        chai.request(server)
        .post('/auth/register')
        .send({
          user: {
            username: 'user123',
            password: 'pass123'
          }
        })
        .end((err, res) => {
          error = err;
          response = res;
          done();
        });
      });

      after((done) => {
        knex('users').del().then(() => {
          done();
        });
      });

      it('should not return an error', (done) => {
        expect(error).to.equal(null);
        done();
      });

      it('should create a new user', (done) => {
        knex('users').then((users) => {
          users.length.should.equal(1);
          users[0].username.should.equal('user123');
          expect(users[0].id).to.exist;
        }).then(() => {
          done();
        });
      });

      it('should return json with a token', (done) => {
        response.status.should.equal(200);
        response.type.should.equal('application/json');
        response.body.message.should.contain('Success');
        response.body.token.should.exist;
        done();
      });
    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
