const mysql = require('mysql');

const USER = process.env.FIRA_DB_USER || 'fira';
const HOST = process.env.FIRA_DB_HOST || 'localhost';
const PASSWORD = process.env.FIRA_DB_PSW || 'fira';
const DATABASE = process.env.FIRA_DB_NAME || 'fira-remind';

function createConnection() {
  return mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
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
}

module.exports = { createConnection, connect, disconnect };
