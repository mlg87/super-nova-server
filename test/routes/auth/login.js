/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

const knex = require('../../../src/server/db/connection');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../../src/server/app');

const tests = () => {
  describe('auth/login', () => {
    const user = {
      username: 'user123',
      password: 'pass123'
    };

    before((done) => {
      chai.request(server)
      .post('/api/auth/register')
      .send({user})
      .end((err, res) => {
        done();
      });
    });

    after(() => {
      knex('users').del()
      .should.be.fulfilled;
    });

    describe('errors', () => {

      it('should not login unregistered user', (done) => {
        chai.request(server)
        .post('/api/auth/login')
        .send({
          user: {
            username: 'user',
            password: 'pass'
          }
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Incorrect username');
          done();
        });
      });

      it('should not login user with wrong password', (done) => {
        chai.request(server)
        .post('/api/auth/login')
        .send({
          user: {
            username: user.username,
            password: 'wrong_pass'
          }
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Incorrect password');
          done();
        });
      });
    });

    describe('success', () => {

      after((done) => {
        knex('users').del().then(() => {
          done();
        });
      });

      it('should login a user', (done) => {
        chai.request(server)
        .post('/api/auth/login')
        .send({user})
        .end((err, res) => {
          res.body.token.should.exist;
          res.body.message.should.contain('Success');
          done();
        });
      });

    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
