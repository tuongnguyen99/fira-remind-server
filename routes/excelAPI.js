const express = require('express');
const router = express.Router();
const excel = require('../controllers/readFileEcxel');
const roomStatus = require('../controllers/roomStatus');
const bodyParser = require('body-parser');

router.get('/teacher', (req, res)=>{
    const ds_gvien = excel.data_gv();
    !ds_gvien ? res.send('err') : res.send(ds_gvien);
})
router.get('/schedule', (req, res)=>{
    const tkb = excel.data_tkb();
    !tkb ? res.send('err'):res.send(tkb);
})
router.get('/room', (req, res)=>{
    const phong = excel.data_p();
    !phong ? res.send('err'):res.send(phong);
})
router.get('/roomuse', (req, res)=>{
    const day = req.body.day;
    const p_sdung = roomStatus.roomUse(day);
    !p_sdung ? res.send('err') : res.send(p_sdung)
})
router.get('/emptyroom', (req, res)=>{
    const day = req.body.day;
    const p_trong = roomStatus.emptyRoom(day);
    !p_trong ? res.send('err') : res.send(p_trong)
})
module.exports = router;