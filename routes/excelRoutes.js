const express = require('express');
const router = express.Router();
const excel = require('../controllers/readFileEcxel');


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

module.exports = router;