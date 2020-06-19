const db = require('../db/db');
const { query } = require('express');
const cn = db.createConnection();

function listTeacher(req, res){
    const m_gvien = req.params;
    const query = `SELECT * FROM tkb_gvien WHERE m_gvien='${m_gvien.ms}'`;
    cn.query(query, (err, results)=>{
        if(err) return res.status(400).send(err.message);
        if(results[0]==null){
            return res.status(404).send({
                message:"Giảng viên này không có lịch nào"
            })
        }
        res.send(results);
    })
}

function changeStatusSchedule(req, res){
    const {id, status} = req.body;
    const query = `UPDATE tkb_gvien SET t_thai='${status}' WHERE id=${id}`;
    cn.query(query, (err)=>{
        if(err) return res.status(400).send(err.message);
        res.send({
            message:"Cập nhật thành công"
        })
    })
}

module.exports = {
    listTeacher,
    changeStatusSchedule
}