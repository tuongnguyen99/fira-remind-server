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

module.exports = {
    list
}