const { createConnection } = require('../db/db');
const { compare } = require('../utils/cryptographer');
const DATABASE = process.env.DATABASENAME || 'remind_db'
const cn = createConnection(DATABASE);
//const session = require('express-session');

const login = function login(req, res) {
  const { username, password } = req.body;
  const query = `SELECT * FROM user WHERE USERNAME = '${username}' LIMIT 1`;
  cn.query(query, (err, results) => {
    if (err) return res.status(400).send(err.message);
    if(results.length === 1){
      if (results[0].type === "STUDENT") {
        const user = results[0];
        delete user.password;
        res.send(user);
      } else if (results.length === 0 || !compare(password, results[0].password)) {
        return res.status(404).send({ message: 'user not found' });
      }else{
        const user = results[0];
        delete user.password;
        req.session.username = user.username;
        res.send(user);
      }
    }else{
      res.status(400).send({message:"khong ton tai"})
    }
  });
};

module.exports = { login };
