const { createConnection } = require('../db/db');
const { compare } = require('../utils/cryptographer');
const cn = createConnection();
const gcalendar = require('../g-calendar/index');

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
async function setToken(req, res){
  const {id, username, access_token, refresh_token, expiry_date} = req.body;
  const query = `UPDATE user SET access_token='${access_token}', refresh_token='${refresh_token}', expiry_date='${expiry_date}' WHERE id=${id};`
  cn.query(query, (err)=>{
    if(err) return res.status(400).send(err.message);
    res.send({
      message:"update complete"
    })
  })
  const m_gv = new Promise(tv=>{
    cn.query(`SELECT * FROM user WHERE id=${id} LIMIT 1`, (err, result)=>{
      if(err) return res.status(400).send(err.message);
      tv(result[0].username);
    })
  })
  const ms= await m_gv;
  const data = {
    m_gv : ms,
    access_token:access_token,
    refresh_token:refresh_token,
    expiry_date:expiry_date
  }
  gcalendar(data);
}
module.exports = {
  login, setToken
};
