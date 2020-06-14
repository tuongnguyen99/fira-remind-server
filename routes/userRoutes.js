const express = require('express');
const router = express.Router();
const { login } = require('../controllers/userController');

router.post('/login', (req, res) => {
  login(req, res);
});

module.exports = router;
