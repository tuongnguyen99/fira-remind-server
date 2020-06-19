const db = require('./db');
const data = require('../utils/readFileEcxel');
const mh = require('../utils/cryptographer');
const { createConnection } = require('./db');
const { text } = require('body-parser');
const DATABASE = process.env.DATABASENAME || 'remind_db'
const con = db.createConnection(DATABASE);

function creatDatabase(name) {
    const pool = db.createConnectionNoDatabase();
    db.connect(pool);
    pool.query("CREATE DATABASE IF NOT EXISTS " + name, (err, result, cb) => {
        if (err) throw err;
        console.log("đã tạo database " + name);
    });
    db.disconnect(pool);
}
function creatTable(sql) {
    con.query(sql, (err, result, cb) => {
        if (err) throw err;
        console.log("complete");
    });
}
function importValue() {
    const dataGv = data.data_gv()
    dataGv.forEach(element => {
        var sql = "INSERT INTO g_vien (m_gvien, t_gvien, n_sinh, phai, khoa, t_do) VALUES ('"
            + element.m_gvien + "','" + element.ten + "','" + element.n_sinh + "','" + element.phai + "','"
            + element.khoa + "','" + element.t_do + "')";
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log('successful');
        })
    });
    const dataTkb = data.data_tkb();
    dataTkb.forEach(element => {
        var sql = "INSERT INTO tkb (thu, t_bdau, s_tiet, m_mon, t_mon, m_gvien, phong, lop, n_bdau, n_kthuc) VALUES ('"
            + element.thu + "', '" + element.t_bdau + "', '"
            + element.s_tiet + "', '" + element.m_mon + "', '"
            + element.t_mon + "', '" + element.m_gvien + "', '"
            + element.phong + "', '" + element.lop + "', '"
            + element.n_bdau + "', '" + element.n_kthuc + "')";
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log('successful');
        })
    });
    const dataPhong = data.data_phong();
    dataPhong.forEach(element => {
        var sql = "INSERT INTO phong (t_phong, khu) VALUES ('" + element.t_phong + "', '" + element.khu + "')";
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log('successful');
        })
    });
    const data_tkb_gv = tkbgv();
    data_tkb_gv.forEach(element => {
        var sql = `INSERT INTO tkb_gvien (id, m_gvien, thu, m_mon, t_mon, t_bdau, s_tiet, ngay, t_thai) VALUES (NULL, '${element.m_gvien}', '${element.thu}', '${element.m_mon}', '${element.t_mon}', '${element.t_bdau}', '${element.s_tiet}', '${element.ngay}', '${element.t_thai}')`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log('successful');
        })
    });
}
async function queryUsermh() {
    const dataGv = data.data_gv()
    const query = new Array();
    dataGv.forEach(element => {
        const m_gvien = String(element.m_gvien);
        const pass = mh.hash(m_gvien);
        console.log(pass);
        const sql = `INSERT INTO user (username, password, password_status, access_token, refresh_token, expiry_date, type) VALUES ('${m_gvien}', '${pass}', '0', NULL, NULL, NULL, 'TEACHER')`;
        query.push(sql);
    })
    return query;
}
function database() {
    const a = queryUsermh();
    //await creatDatabase(DATABASE);
    const gv = "CREATE TABLE IF NOT EXISTS `remind_db`.`g_vien` ( `id` INT NOT NULL AUTO_INCREMENT , `m_gvien` TEXT NOT NULL , `t_gvien` VARCHAR(50) NOT NULL , `n_sinh` TEXT NOT NULL, `phai` VARCHAR(5) NOT NULL, `khoa` VARCHAR(100) NOT NULL , `t_do` VARCHAR(20) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;"
    const tkb = "CREATE TABLE IF NOT EXISTS `remind_db`.`tkb` ( `id` INT NOT NULL AUTO_INCREMENT , `thu` INT NOT NULL , `t_bdau` INT NOT NULL , `s_tiet` INT NOT NULL , `m_mon` TEXT NOT NULL , `t_mon` VARCHAR(50) NOT NULL , `m_gvien` TEXT NOT NULL , `phong` TEXT NOT NULL , `lop` TEXT NOT NULL , `n_bdau` DATE NOT NULL , `n_kthuc` DATE NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    const phong = "CREATE TABLE IF NOT EXISTS `remind_db`.`phong` ( `id` INT NOT NULL AUTO_INCREMENT , `t_phong` TEXT NOT NULL , `khu` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    const user = "CREATE TABLE IF NOT EXISTS `remind_db`.`user` ( `id` INT NOT NULL AUTO_INCREMENT , `username` TEXT NOT NULL , `password` TEXT NULL , `password_status` BOOLEAN NOT NULL , `access_token` TEXT NULL , `refresh_token` TEXT NULL , `expiry_date` TEXT NULL , `type` TEXT NOT NULL , PRIMARY KEY (`id`), UNIQUE (`username`)) ENGINE = InnoDB;";
    const tkb_gvien = "CREATE TABLE `remind_db`.`tkb_gvien` ( `id` INT NOT NULL AUTO_INCREMENT , `m_gvien` TEXT NOT NULL , `thu` INT NOT NULL , `m_mon` TEXT NOT NULL , `t_mon` VARCHAR(100) NOT NULL , `t_bdau` INT NOT NULL , `s_tiet` INT NOT NULL , `ngay` DATE NOT NULL , `t_thai` VARCHAR(10) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    creatDatabase(DATABASE);
    creatTable(gv);
    creatTable(tkb_gvien);
    creatTable(tkb);
    creatTable(phong);
    creatTable(user);
    importValue();
    a.then(test => {
        test.forEach(element => {
            creatTable(element);
        })
    })
}
opjectTkbGvien = (opject, ngay)=>{
    return{
        m_gvien: opject.m_gvien,
        thu: opject.thu,
        m_mon: opject.m_mon,
        t_mon: opject.t_mon,
        t_bdau: opject.t_bdau,
        s_tiet: opject.s_tiet,
        ngay: ngay,
        t_thai:"Học"
    }
}
function tkbgv() {
    const dl = data.tkb_gvien()
    var n_bdau, n_kthuc, thu;
    const dayMap = {
        2:1,
        3:2,
        4:3,
        5:4,
        6:5,
        7:6,
        8:0,
    }
    const tkb_gvien = new Array();
    dl.forEach(element => {
        n_bdau = new Date(element.n_bdau);
        n_kthuc = new Date(element.n_kthuc);
        thu = element.thu;
        for (var i = n_bdau.getMonth() + 1; i <= n_kthuc.getMonth() + 1; i++) {
            for (var j = n_bdau.getDate(); j <= n_kthuc.getDate(); j++) {
                const day = new Date(`2019/'${i}'/'${j}'`)
                //console.log(day);
                if(day.getDay()===dayMap[element.thu]){
                    var ngay = `${day.getFullYear()}/${day.getMonth()}/${day.getDate()}`
                    tkb_gvien.push(opjectTkbGvien(element,ngay))
                }
            }
        }
    })
    // const test = new Date('2019-11-09T17:00:00.000Z');
    return tkb_gvien;
}
// importValue()
database()
module.exports = database;