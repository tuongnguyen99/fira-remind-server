const mysql = require('mysql');
const data = require('../nitu/readFileEcxel');
require('dotenv').config();

creatDatabase = (host, user, pass, name)=>{

    const con =  mysql.createConnection({
        host: host,
        user: user,
        password:pass
    })
    con.connect((err)=>{
        if(err) throw err;
        con.query("CREATE DATABASE IF NOT EXISTS "+name, (err, result, cb)=>{
          if(err)throw err;
          console.log('tao database: '+name);
        })
        const dataGv = data.data_gv()
        dataGv.forEach(element => {
            var sql = "INSERT INTO giang_vien (ma_gv, ten, ngay_sinh, khoa, trinh_do) VALUES ('"
                + element.msgv + "','" + element.ten + "','" + element.ngay_sinh + "','"
                + element.khoa + "','" + element.trinh_do + "')";
            pool.query(sql, (err, result) => {
                if (err) throw err;
                console.log('successful');
            })
        });
        const dataTkb = data.data_tkb();
        dataTkb.forEach(element => {
            var sql = "INSERT INTO tkb (thu, tiet_bd, ma_mon, ten_mon, ma_gv, phong, lop, ngay_bd, ngay_kt) VALUES ('"
                + element.thu + "', '" + element.tiet_bd + "', '"
                + element.ma_mon + "', '" + element.ten_mon + "', '"
                + element.magv + "', '" + element.phong + "', '"
                + element.lop + "', '" + element.ngay_bd + "', '"
                + element.ngay_kt + "')";
            pool.query(sql, (err, result) => {
                if (err) throw err;
                console.log('successful');
            })
        });
        const dataPhong = data.data_p();
        dataPhong.forEach(element => {
            var sql = "INSERT INTO phong (ten_phong) VALUES ('"+ element+ "')";
            pool.query(sql, (err, result) => {
                if (err) throw err;
                console.log('successful');
            })
        });
        con.end();
    })
}

//creatDatabase(process.env.HOST_DATABASE, process.env.USERNAME, process.env.PASSWORD, "ABC");
creatDatabase('localhost', 'root','', 'abc');


