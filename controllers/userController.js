const { createConnection } = require('../db/db');
const { compare } = require('../utils/cryptographer');
const cn = createConnection();

const cvtToResponse = (user) => {
  return (response = {
    id: user.id,
    username: user.username,
    type: user.type,
    passwordChanged: user.password_status,
    hasToken: user.access_token ? 1 : 0,
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
function setToken(req, res){
  const {id, access_token, refresh_token, expiry_date} = req.body;
  const query = `UPDATE user SET access_token='${access_token}', refresh_token='${refresh_token}', expiry_date='${expiry_date}' WHERE id=${id};`
  console.log(query);
  cn.query(query, (err)=>{
    if(err) return res.status(400).send(err.message);
    res.send({
      message:"update complete"
    })
  })
}
module.exports = {
  login, setToken
};
