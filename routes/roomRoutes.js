const express = require('express');
const router = express.Router();
const roomStatus = require('../controllers/roomStatus');

router.get('/roomuse', (req, res)=>{
    const day = req.body.day;
    const p_sdung = roomStatus.roomUse(day);
    !p_sdung ? res.send('err') : res.send(p_sdung)
})
router.get('/emptyroom', (req, res)=>{
    const day = req.body.day;
    const p_trong = roomStatus.emptyRoom(day);
    !p_trong ? res.send('err') : res.send(p_trong);
})

module.exports = router;