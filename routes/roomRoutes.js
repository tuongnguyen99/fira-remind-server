const express = require('express');
const router = express.Router();
const roomStatus = require('../controllers/roomController');

router.get('/roomuse/:day', (req, res)=>{
    roomStatus.roomUse(req, res);
})
router.get('/emptyroom/:day', (req, res)=>{
    roomStatus.emptyRoom(req, res);
})
router.get('/statusroom/:day', (req, res)=>{
    roomStatus.statusRoom(req, res);
})

module.exports = router;