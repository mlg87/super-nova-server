const environment = process.env.NODE_ENV;
console.log('password is:', process.env.DB_PASSWORD);
const config = require('../../../knexfile.js')[environment];
module.exports = require('knex')(config);
