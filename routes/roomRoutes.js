const express = require('express');
const router = express.Router();
const roomStatus = require('../controllers/roomController');

//hiển thị
router.get('/roomuse/:day', (req, res)=>{
    roomStatus.roomUse(req, res);
})
router.get('/emptyroom/:day', (req, res)=>{
    roomStatus.emptyRoom(req, res);
})
router.get('/statusroom/:day', (req, res)=>{
    roomStatus.statusRoom(req, res);
})

//xử lý
router.get('/listemptyroom/:day', (req, res)=>{
    roomStatus.listEmptyRoom(req, res);
})
router.post('/arrangeroom', (req, res)=>{
    roomStatus.arrangeRoom(req, res);
})
module.exports = router;