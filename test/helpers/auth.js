/*jshint -W117*/
/*jshint -W079*/
/*jshint -W030*/

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

const authHelpers = require('../../src/server/helpers/auth');

module.exports = () => {

  describe('encodeToken()', () => {

    it('should return a token', (done) => {
      const results = authHelpers.encodeToken({id: 1});
      should.exist(results);
      results.should.be.a('string');
      done();
    });

  });

  describe('decodeToken()', () => {

    it('should return a token', (done) => {
      const token = authHelpers.encodeToken({id: 1, username: 'user123'});
      should.exist(token);
      const results = authHelpers.decodeToken(token, (err, res) => {
        should.not.exist(err);
        res.sub.should.eql(1);
        res.username.should.eql('user123');
        done();
      });

    });

  });

};
