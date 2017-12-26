// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'santa',
      host: 'localhost'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: 'ec2-184-72-228-128.compute-1.amazonaws.com',
      database: 'd71lu99g3mqthk',
      user:     'gpxabweagcpqff',
      password: 'a6a8721fc9aed73f64cc5e146735276ca3e60bb5f8beb70991ce7122b9c2a290'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'ec2-184-72-228-128.compute-1.amazonaws.com',
      database: 'd71lu99g3mqthk',
      user:     'gpxabweagcpqff',
      password: 'a6a8721fc9aed73f64cc5e146735276ca3e60bb5f8beb70991ce7122b9c2a290'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
