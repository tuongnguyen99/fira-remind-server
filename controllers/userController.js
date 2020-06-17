const { createConnection } = require('../db/db');
const { compare } = require('../utils/cryptographer');
const cn = createConnection();

const cvtToResponse = (user) => {
  return (response = {
    id: user.id,
    username: user.username,
    type: user.type,
    passwordChanged: user.password_status,
    hasAccessToken: user.access_token ? 1 : 0,
    hasRefreshToken: user.refresh_token ? 1 : 0,
  });
};

const login = function login(req, res) {
  const { username, password, type } = req.body;
  const query = `SELECT * FROM USER WHERE USERNAME = '${username}' LIMIT 1`;
  cn.query(query, (err, results) => {
    if (err) return res.status(400).send(err.message);

    const user = results[0];
    if (user && type === 'STUDENT') {
      return res.send(cvtToResponse(user));
    }

    if (!user || !compare(password, user.password) || user.type !== type)
      return res.status(404).send({ message: 'user not found' });
    res.send(cvtToResponse(user));
  });
};

module.exports = login;
