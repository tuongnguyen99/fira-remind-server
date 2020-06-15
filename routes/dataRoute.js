const express = require('express');
const router = express.Router();
const data = require('../controllers/dataController');

router.get('/teacher', (req, res)=>{
    const ds_gvien = excel.data_gv();
    !ds_gvien ? res.send('err') : res.send(ds_gvien);
})
router.get('/schedule', (req, res)=>{
    const tkb = excel.data_tkb();
    !tkb ? res.send('err'):res.send(tkb);
})
router.get('/room', (req, res)=>{
    data.listRoom(req, res);
})

module.exports = router;