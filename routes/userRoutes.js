const express = require('express');
const router = express.Router();
const { login } = require('../controllers/userController');

router.post('/login', (req, res) => {
  login(req, res);
});
router.get('/getInfo', (req, res)=>{
  if(req.session.username){
    return res.send(req.session.username)
  }
  res.send("chua dang nhap");
})
module.exports = router;
