const { createConnection } = require('../db/db');
const { compare } = require('../utils/cryptographer');
const cn = createConnection();

const cvtToResponse = (user) => {
  return (response = {
    id: user.id,
    username: user.username,
    passwordChanged: user.password_status,
    hasAccessToken: user.access_token ? 1 : 0,
    hasRefreshToken: user.refresh_token ? 1 : 0,
  });
};

const login = function login(req, res) {
  const { username, password } = req.body;
  const query = `SELECT * FROM USER WHERE USERNAME = '${username}' LIMIT 1`;
  cn.query(query, (err, results) => {
    console.log(results);

    if (err) return res.status(400).send(err.message);

    if (results.length === 0 || !compare(password, results[0].password))
      return res.status(404).send({ message: 'user not found' });

    const user = results[0];

    res.send(cvtToResponse(user));
  });
};

module.exports = login;
