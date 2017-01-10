const databaseName = 'supernova';
require('dotenv').config()

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host : process.env.RDS_HOSTNAME || 'localhost',
      user : process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      port: process.env.RDS_PORT || '5432',
      database : databaseName
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  },
  test: {
    client: 'postgresql',
    connection: `postgres://localhost:5432/${databaseName}_test`,
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  }
};
