const { createConnection } = require('../db/db');
const { compare } = require('../utils/cryptographer');
const cn = createConnection();
const gcalendar = require('../g-calendar/index');
const emaill = require('../utils/email');

const cvtToResponse = (user) => {
  return (response = {
    id: user.id,
    username: user.username,
    email: emaill.cvtNameToEmail(user.t_gvien || user.username, '@bdu.edu.vn'),
    type: user.type,
    passwordChanged: user.password_status,
    hasToken: user.access_token ? 1 : 0,
  });
};

function userStudent(username){
  return new Promise(tv => {
    const query = `SELECT * FROM user WHERE username='${username}'`;
    cn.query(query, (err, results)=>{
      if(err) return res.status(400).send(err.message);
      tv(results[0]);
    })
  })
}

const login =async function login(req, res) {
  const { username, password, type } = req.body;
  if (type == 'STUDENT') {
    const user = await userStudent(username);
    if(!user){
      const message = await new Promise(tv=>{
        cn.query(`INSERT INTO user (id, username, password, password_status, access_token, refresh_token, expiry_date, type) VALUES (NULL, '${username}', NULL, '1', NULL, NULL, NULL, '${type}')`, (err)=>{
          if(err) return tv(err.message);
          tv('ok');
        })
      })
      if(message === 'ok'){
        const info = await userStudent(username);
        res.send(cvtToResponse(info));
        console.log("chua co");
      }
    }else{
      console.log("da co");
      res.send(cvtToResponse(user));
    }
  } else {
    const query = `SELECT g_vien.t_gvien, user.id, user.username, user.password, user.password_status, user.access_token, user.refresh_token, user.expiry_date, user.type FROM g_vien, user WHERE user.username = g_vien.m_gvien AND user.username = '${username}'`;
    cn.query(query, (err, results) => {
      if (err) return res.status(400).send(err.message);
      const user = results[0];
      if (
        !user ||
        !user.password ||
        !compare(password, user.password) ||
        user.type !== type
      )
        return res.status(404).send({ message: 'user not found' });
      res.send(cvtToResponse(user));
    });
  }
};
async function setToken(req, res) {
  const { id, username, access_token, refresh_token, expiry_date } = req.body;
  const query = `UPDATE user SET access_token='${access_token}', refresh_token='${refresh_token}', expiry_date='${expiry_date}' WHERE id=${id};`;
  cn.query(query, (err) => {
    if (err) return res.status(400).send(err.message);
    res.send({
      message: 'update complete',
    });
  });
  const m_gv = new Promise((tv) => {
    cn.query(`SELECT * FROM user WHERE id=${id} LIMIT 1`, (err, result) => {
      if (err) return res.status(400).send(err.message);
      tv(result[0].username);
    });
  });
  const ms = await m_gv;
  const data = {
    m_gv: ms,
    access_token: access_token,
    refresh_token: refresh_token,
    expiry_date: expiry_date,
  };
  gcalendar(data);
}
module.exports = {
  login,
  setToken,
};
