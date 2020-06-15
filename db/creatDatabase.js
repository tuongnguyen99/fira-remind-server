const db = require('./db');
const data = require('../utils/readFileEcxel');
const DATABASE = process.env.DATABASENAME || 'remind_db'

function creatDatabase(name) {
    const pool = db.createConnectionNoDatabase();
    db.connect(pool);
    pool.query("CREATE DATABASE IF NOT EXISTS " + name, (err, result, cb) => {
        if (err) throw err;
        console.log("đã tạo database "+name);
    });
    db.disconnect(pool);
}
function creatTable(sql) {
    const pool = db.createConnection(DATABASE);
    db.connect(pool);
    pool.query(sql, (err, result, cb) => {
        if (err) throw err;
        console.log("complete");
    });
    db.disconnect(pool);
}
async function importValue() {
    console.log("day")
    const pool = await db.createConnection(DATABASE);
    await db.connect(pool);
    const dataGv = data.data_gv()
    dataGv.forEach(element => {
        var sql = "INSERT INTO g_vien (m_gvien, t_gvien, n_sinh, khoa, t_do) VALUES ('"
            + element.m_gvien + "','" + element.ten + "','" + element.n_sinh + "','"
            + element.khoa + "','" + element.t_do + "')";
        pool.query(sql, (err, result) => {
            if (err) throw err;
            console.log('successful');
        })
    });
    const dataTkb = data.data_tkb();
    dataTkb.forEach(element => {
        var sql = "INSERT INTO tkb (thu, t_bdau, s_tiet, m_mon, t_mon, m_gvien, phong, lop, n_bdau, n_kthuc) VALUES ('"
            + element.thu + "', '" + element.t_bdau + "', '"
            + element.s_tiet + "', '" + element.m_mon + "', '"
            + element.t_mon + "', '" + element.m_gv + "', '"
            + element.phong + "', '" + element.lop + "', '"
            + element.n_bdau + "', '"+element.n_kthuc+"')";
        pool.query(sql, (err, result) => {
            if (err) throw err;
            console.log('successful');
        })
    });
    const dataPhong = data.data_phong();
    dataPhong.forEach(element => {
        var sql = "INSERT INTO phong (t_phong, khu) VALUES ('" + element.t_phong+ "', '"+element.khu+"')";
        pool.query(sql, (err, result) => {
            if (err) throw err;
            console.log('successful');
        })
    });
    db.disconnect(pool);
}
async function database() {
    //await creatDatabase(DATABASE);
    const gv = "CREATE TABLE IF NOT EXISTS `remind_db`.`g_vien` ( `id` INT NOT NULL AUTO_INCREMENT , `m_gvien` TEXT NOT NULL , `t_gvien` VARCHAR(50) NOT NULL , `n_sinh` TEXT NOT NULL , `khoa` VARCHAR(100) NOT NULL , `t_do` VARCHAR(20) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;"
    const tkb = "CREATE TABLE IF NOT EXISTS `remind_db`.`tkb` ( `id` INT NOT NULL AUTO_INCREMENT , `thu` INT NOT NULL , `t_bdau` INT NOT NULL , `s_tiet` INT NOT NULL , `m_mon` TEXT NOT NULL , `t_mon` VARCHAR(50) NOT NULL , `m_gvien` TEXT NOT NULL , `phong` TEXT NOT NULL , `lop` TEXT NOT NULL , `n_bdau` DATE NOT NULL , `n_kthuc` DATE NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    const phong = "CREATE TABLE IF NOT EXISTS `remind_db`.`phong` ( `id` INT NOT NULL AUTO_INCREMENT , `t_phong` TEXT NOT NULL , `khu` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    const token = "CREATE TABLE IF NOT EXISTS `remind_db`.`token_calendar` ( `id` INT NOT NULL AUTO_INCREMENT , `email` TEXT NOT NULL , `token` TEXT NOT NULL , `status` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    const user = "CREATE TABLE IF NOT EXISTS `remind_db`.`user` ( `id` INT NOT NULL AUTO_INCREMENT , `username` TEXT NOT NULL , `password` TEXT NOT NULL , `type` TEXT NOT NULL , `status` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    //creatDatabase(DATABASE);
    await creatTable(gv);
    await creatTable(tkb);
    await creatTable(phong);
    await creatTable(token);
    await creatTable(user);
    await importValue();
}

database()
module.exports = database;