const { createConnection } = require('../db/db');
const { compare } = require('../utils/cryptographer');
const DATABASE = process.env.DATABASENAME || 'remind_db'
const cn = createConnection(DATABASE);

const login = function login(req, res) {
  const { username, password } = req.body;
  var convert;
  if (password.length === 0) {
    convert = null;
  }
  const query = `SELECT * FROM user WHERE USERNAME = '${username}' LIMIT 1`;
  console.log(query)
  cn.query(query, (err, results) => {
    console.log(results[0].type);
    if (err) return res.status(400).send(err.message);
    if (results[0].type === "STUDENT") {
      const user = results[0];
      delete user.password;
      res.send(user);
    } else if (results.length === 0 || !compare(convert, results[0].password)) {
      return res.status(404).send({ message: 'user not found' });
    }else{
      const user = results[0];
      delete user.password;
      res.send(user);
    }

  });
};

module.exports = { login };
