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

module.exports = () => {
  describe('auth/login', () => {

    describe('errors', () => {
      before((done) => {
        done();
      });
      after((done) => {
        done();
      });

      it('should redirect if login is unsuccessful', (done) => {
        chai.request(server)
        .post('/auth/login')
        .send({
          user: {
            username: 'user',
            password: 'pass'
          }
        })
        .end((err, res) => {
          expect(res.redirects.length).to.equal(1);
          done();
        });
      });
    });

    describe('success', () => {

      const user = {
        username: 'user123',
        password: 'pass123'
      };

      before((done) => {
        chai.request(server)
        .post('/auth/register')
        .send({user})
        .end((err, res) => {
          done();
        });
      });

      after((done) => {
        knex('users').del().then(() => {
          done();
        });
      });

      it('should login a user', (done) => {
        chai.request(server)
        .post('/auth/login')
        .send({user})
        .end((err, res) => {
          res.body.user.username.should.equal(user.username);
          res.body.user.id.should.exist;
          done();
        });
      });

    });
  });
};
