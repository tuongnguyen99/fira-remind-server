const db = require('../db/db');
const { query } = require('express');
const cn = db.createConnection();

async function list(req, res) {
    const day = req.params;
    const query = `SELECT * FROM tkb_gvien WHERE ngay='${day.day}'`
    cn.query(query, (err, results) => {
        if (err) return res.status(400).send(err.message);
        res.send(results);
    })
}

function evaluate(req, res) {
    const data = req.body;
    const cvt = {
        true: 1, false: 0
    }
    const query = `INSERT INTO thanhtra (id, m_ttra, giovipham, sisothucte, gv_botiet, gv_ditre, gv_nghisom, gv_saiten, gv_daykhongthongbao, chitiet, id_tkb) VALUES (NULL, '${data.ms_thanhtra}', '${data.giovipham}', '${data.sisothucte}', '${cvt[data.gv_botiet]}', '${cvt[data.gv_ditre]}', '${cvt[data.gv_nghisom]}', '${cvt[data.gv_saiten]}', '${cvt[data.gv_daykhongbao]}', '${data.chitiet}', '${data.id_tkb}')`;
    cn.query(query, err => {
        if (err) return res.status(400).send(err.message);
        res.send({
            message: "Cập nhật thành công"
        })
    })
}
cvtToEvaluate = (opject) => {
    const cvt = {
        1: true, 0: false
    }
    return {
        id: opject.id,
        m_ttra: opject.m_ttra,
        giovipham: opject.giovipham,
        sisothucte: opject.sisothucte,
        gv_botiet: cvt[opject.gv_botiet],
        gv_ditre: cvt[opject.gv_ditre],
        gv_nghisom: cvt[opject.gv_nghisom],
        gv_saiten: cvt[opject.gv_saiten],
        gv_daykhongthongbao: cvt[opject.gv_daykhongthongbao],
        chitiet: opject.chitiet,
        id_tkb: opject.id_tkb
    }
}
async function getEvaluate(req, res) {
    const id_tkb = req.params.id_tkb;
    const query = `SELECT * FROM thanhtra WHERE id_tkb='${id_tkb}'`;
    const data = await new Promise(tv => {
        cn.query(query, (err, results) => {
            if (err) return res.status(400).send(err.message);
            tv(results);
        })
    })
    const dl = new Array();
    data.forEach(element => {
        dl.push(cvtToEvaluate(element));
    });
    res.send(dl);
}

module.exports = {
    list, evaluate, getEvaluate
}