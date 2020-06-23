const express = require('express');
const route = express.Router();
const inspect = require('../controllers/inspectController');

route.get('/list/:day', (req, res)=>{
    inspect.list(req, res);
})
route.get('/evaluate/:id_tkb', (req, res)=>{
    // inspect.getEvaluate(req, res);
})
route.post('/evaluate', (req, res)=>{
    inspect.evaluate(req, res);
})
module.exports = route;