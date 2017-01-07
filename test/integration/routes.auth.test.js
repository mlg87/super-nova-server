process.env.NODE_ENV = 'test';

const knex = require('../../src/server/db/connection');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect

const server = require('../../src/server/app');

describe('routes : auth/register', () => {
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
    })
  });

  after((done) => {
    knex('users').del().then(() => {
      done();
    })
  });

  describe('POST /auth/register', () => {

    it('should not return an error', (done) => {
      expect(error).to.equal(null);
      done();
    });

    it('should create a new user', (done) => {
      knex('users').then((users) => {
        users.length.should.equal(1);
        users[0].username.should.equal('user123');
        users[0].id.should.be.defined;
      }).then(() => {
        done()
      });
    });

    it('should return json', (done) => {
      response.status.should.equal(200);
      response.type.should.equal('application/json');
      response.body.message.should.contain('Success');
      done();
    });
  });

});
