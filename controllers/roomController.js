const { createConnection } = require('../db/db');
const DATABASE = process.env.DATABASENAME || 'remind_db'
const cn = createConnection(DATABASE);

function roomUse(req, res) {
    var day = req.params;
    day = day.day.replace(/-/g, "/");
    const p_sdung = new Array();
    const query = "select * from tkb";
    cn.query(query, (err, results) => {
        if (err) return res.status(400).send(err.message);
        const tkb = results
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
                        phong: element.phong,
                        t_mon: element.t_mon,
                        t_bdau: element.t_bdau,
                        t_kthuc: element.t_bdau + element.s_tiet
                    }
                    p_sdung.push(abc);
                }
            }
        });
        res.status(200).send(p_sdung);
    })
}
function emptyRoom(req, res){
    var day = req.params;
    day = day.day.replace(/-/g, "/")
    const query = "select * from phong";
    cn.query(query,async (err, results) => {
        if (err) return res.status(400).send(err.message);
        const phong = results;
        const tkb = await test(day);
        console.log(await tkb)
        // tkb.forEach(element => {
        //     phong.splice(phong.indexOf(element.phong), 1)
        // });
        // console.log(phong.length)
        // res.status(200).send(phong)
    })

}
// roomUse("2019/9/7")
// emptyRoom()
async function te(){
    console.log(await test('2019/09/16'));
}
te()
module.exports = {
    roomUse, emptyRoom
}