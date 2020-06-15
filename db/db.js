const mysql = require('mysql');

const USER = process.env.FIRA_DB_USER || 'root';
const HOST = process.env.FIRA_DB_HOST || 'localhost';
const PASSWORD = process.env.FIRA_DB_PSW || '';
// const USER = process.env.FIRA_DB_USER || 'reminddb';
// const HOST = process.env.FIRA_DB_HOST || 'db4free.net';
// const PASSWORD = process.env.FIRA_DB_PSW || 'reminddb';

function createConnection(databaseName) {
  return mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: databaseName,
  });
}

function createConnectionNoDatabase() {
  return mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
  });
}

function connect(connection) {
  connection.connect((err) => {
    if (err) {
      throw new Error(err.message);
    }
    console.log('db connected');
  });
}

function disconnect(connection) {
  connection.end();
  console.log('db disconnected');
}

module.exports = { createConnection, createConnectionNoDatabase, connect, disconnect };
