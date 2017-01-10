const databaseName = 'supernova';

module.exports = {
  development: {
    client: 'postgresql',
    connection: `postgres://localhost:5432/${databaseName}`,
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  },
  remote_dev: {
    client: 'postgresql',
    connection: {
      host : 'supernova.c6tx9kdtvryv.us-west-2.rds.amazonaws.com',
      user : 'supernova',
      password: process.env.DB_PASSWORD,
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
