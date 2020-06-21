const express = require('express');
const route = express.Router();
const inspect = require('../controllers/inspectController');

route.get('/list/:day', (req, res)=>{
    inspect.list(req, res);
})

module.exports = route;