const express = require('express');
const router = express.Router();
const uploadFiles = require('../controllers/uploadController');

router.post('/', (req, res) => {
  uploadFiles(req, res);
});

module.exports = router;
