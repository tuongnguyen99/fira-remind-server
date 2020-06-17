const express = require('express');
const login = require('../controllers/userController');
const router = express.Router();

router.post('/login', (req, res) => {
  login(req, res);
});
router.get('/getInfo', (req, res) => {
  if (req.session.username) {
    return res.send(req.session.username);
  }
  res.send('1');
});
module.exports = router;
