
const knexLib = require('knex');

const dbConfig = {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'order_management_system',
  },
};

// First connect without a database to create it
const initialKnex = knexLib({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
  },
});

const knex = knexLib(dbConfig);

// Ensure database and table (only once on server start)
initialKnex.raw('CREATE DATABASE IF NOT EXISTS order_management_system')
  .then(() => {
    console.log('Database ensured');

    // Check and create table if needed
    return knex.schema.hasTable('orders').then((exists) => {
      if (!exists) {
        return knex.schema.createTable('orders', (table) => {
          table.increments('id').primary();
          table.string('customerName', 30).notNullable();
          table.string('email', 100).notNullable();
          table.string('contactNumber', 10).notNullable();
          table.string('address', 100).notNullable();
          table.string('productName', 50).notNullable();
          table.integer('quantity').notNullable();
          table.string('productImage', 500).notNullable();
          table.timestamp('createdAt').defaultTo(knex.fn.now());
        }).then(() => {
          console.log('Table "orders" created');
        });
      } else {
        console.log('ℹTable "orders" already exists');
      }
    });
  })
  .catch((err) => {
    console.error('Error ensuring DB or table:', err);
  });

module.exports = knex; 
