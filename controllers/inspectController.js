const db = require('../db/db');
const { query } = require('express');
const cn = db.createConnection();

async function list(req, res){
    const day = req.params;
    const query = `SELECT * FROM tkb_gvien WHERE ngay='${day.day}'`
    cn.query(query, (err, results)=>{
        if(err) return res.status(400).send(err.message);
        res.send(results);
    })
}

function evaluate(req, res){
    const data = req.body;
    const query = `INSERT INTO thanhtra (id, m_ttra, giovipham, sisothucte, gv_botiet, gv_ditre, gv_nghisom, gv_saiten, gv_daykhongthongbao, chitiet, id_tkb) VALUES (NULL, '${data.ms_thanhtra}', '${data.giovipham}', '${data.sisothucte}', '${data.gv_botiet}', '${data.gv_ditre}', '${data.gv_nghisom}', '${data.gv_saiten}', '${data.gv_daykhongbao}', '${data.chitiet}', '${data.id_tkb}')`;
    cn.query(query, err=>{
        if(err) return res.status(400).send(err.message);
        res.send({
            message:"Cập nhật thành công"
        })
    })
}
function getEvaluate(req, res){
    const id_tkb = req.params.id_tkb;
    const query = `SELECT * FROM thanhtra WHERE id_tkb='${id_tkb}'`;
    cn.query(query,(err, results)=>{
        if(err) return res.status(400).send(err.message);
        res.send(results);
    })
}

module.exports = {
    list, evaluate, getEvaluate
}