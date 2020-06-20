const { createConnection } = require('../db/db');
const cn = createConnection();

async function roomUse(req, res) {
    var day = req.params;
    day = day.day.replace(/-/g, "/");
    const p_sdung = await dataUseRoom(day, res);
    res.status(200).send(p_sdung);
}
async function emptyRoom(req, res) {
    var day = req.params;
    day = day.day.replace(/-/g, "/");
    const phong = await dataEmptyRoom(day, res);
    res.status(200).send(phong);
}
async function statusRoom(req, res) {
    var day = req.params;
    day = day.day.replace(/-/g, "/");
    const data = await dataStatusRoom(day, res);
    res.status(200).send(data);
}

function dataUseRoom(day, res) {
    const data = new Promise(tv => {
        const query = "select * from tkb";
        cn.query(query, (err, results) => {
            if (err) return res.status(400).send(err.message);
            const tkb = results
            const p_sdung = new Array();
            const ht = new Date(day);
            const dayMap = {
                '0': 8,
                '1': 2,
                '2': 3,
                '3': 4,
                '4': 5,
                '5': 6,
                '6': 7,
            };
            //console.log(ht.getHours());
            tkb.forEach(element => {
                if (element.n_bdau != '0000-00-00') {
                    const ngay_bd = new Date(element.n_bdau);
                    const ngay_kt = new Date(element.n_kthuc);
                    if (ngay_bd < ht && ht <= ngay_kt && element.thu == dayMap[ht.getDay()]) {
                        var abc = {
                            t_phong: element.phong,
                            t_mon: element.t_mon,
                            t_bdau: element.t_bdau,
                            t_kthuc: element.t_bdau + element.s_tiet
                        }
                        p_sdung.push(abc);
                    }
                }
            });
            tv(p_sdung);
        })
    })
    return data;
}
function dataEmptyRoom(day, res) {
    const data = new Promise(tv => {
        const query = "select * from phong";
        cn.query(query, async (err, results) => {
            if (err) return res.status(400).send(err.message);
            const phong = results;
            const tkb = await dataUseRoom(day, res);
            const stringJson = JSON.stringify(tkb);
            phong.forEach((element, i) => {
                if(stringJson.indexOf(element.t_phong)!== -1){
                    phong.splice(i, 1);
                }
            });
            tv(phong);
        })
    });
    return data;
}
room = (opject, st) => {
    return {
        id: opject.id,
        t_phong: opject.t_phong,
        khu: opject.khu,
        status: st
    }
}
async function dataStatusRoom(day, req, res) {
    const data = await new Promise(tv => {
        const query = "select * from phong";
        cn.query(query, (err, result) => {
            if (err) return res.status(400).send(err.message);
            tv(result);
        });
    });
    var statusInRoom = new Array();
    const empty = await dataEmptyRoom(day, req, res);
    const stringJson = JSON.stringify(empty);
    data.forEach((element, i) => {
        var st;
        if(stringJson.indexOf(element.t_phong)!== -1){
            st = "EMPTY";
            statusInRoom.push(room(data[i],st));
        }else{
            st = "USING";
            statusInRoom.push(room(data[i],st));
        }
    });
    return statusInRoom;
}
//dataStatusRoom();
module.exports = {
    roomUse, emptyRoom, statusRoom
}