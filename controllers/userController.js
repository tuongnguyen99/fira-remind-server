const { createConnection, connect, disconnect } = require('../db/db');
const cn = createConnection();

const login = function login(req, res) {
  const { username, password } = req.body;
  connect(cn);
  const query = `SELECT * FROM USER WHERE USERNAME = '${username}' AND PASSWORD = '${password}' LIMIT 1`;
  cn.query(query, (err, results) => {
    disconnect(cn);
    if (err) res.status(400).send(err.message);
    else {
      if (results.length === 0) {
        return res.status(404).send({ message: 'user not found' });
      }
      const user = results[0];
      delete user.password;
      res.send(user);
    }
  });
};

module.exports = { login };
