const data = require('./readFileEcxel');
roomUse = (day)=>{
    const tkb = data.data_tkb();
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
            if(ngay_bd<ht && ht<=ngay_kt && element.thu==dayMap[ht.getDay()]){
                var abc={
                    phong: element.phong,
                    t_mon: element.t_mon,
                    t_bdau: element.t_bdau,
                    t_kthuc: element.t_bdau+element.s_tiet
                }
                p_sdung.push(abc);
            }
        }
    });
    return p_sdung;
}
emptyRoom = (day)=>{
    const phong = data.data_phong();
    const test = roomUse(day);
    test.forEach(element=>{
        phong.splice(phong.indexOf(element.phong), 1)
    });
    return phong;
}
//roomUse("2019/9/7")
// emptyRoom()
module.exports = {
    roomUse,
    emptyRoom
}