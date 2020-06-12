const xlsx = require('xlsx');
const pathTkb = "./upload/Thời khóa biểu học kỳ 1 năm học 2019-20202.xlsx";
const pathGv = "./upload/CBGD.xls";


convertToOjectGv = (opject) => {
    return {
        m_gvien: opject.msgv,
        ten: opject.__EMPTY + ' ' + opject.__EMPTY_1,
        n_sinh: opject.__EMPTY_2,
        //  phai: opject.__EMPTY_3,
        khoa: opject.__EMPTY_4,
        t_do: opject.__EMPTY_5
    }
}

convertDateMysql = (arry) => {
    const date = arry.split('/').reverse();
    date[0] = 20 + date[0];
    return date.join('/')
}
convertToOjectTkb = (opject) => {
    var ngay_bd, ngay_kt, ma_gv;
    if (opject.f_tghoc == null) {
        ngay_bd = null;
        ngay_kt = null;
    } else {
        const date = opject.f_tghoc.split('-');
        ngay_bd = convertDateMysql(date[0]);
        ngay_kt = convertDateMysql(date[1]);
    }
    if(opject.f_manv==null){
        ma_gv = null;
    }else{
        ma_gv = opject.f_manv;
    }
    return {
        thu: opject.f_thu,
        t_bdau: opject.f_tietbd,
        s_tiet:opject.f_sotiet,
        m_mon: opject.f_mamh,
        t_mon: opject.f_tenmhvn,
        m_gvien: ma_gv,
        phong: opject.f_tenph,
        lop: opject.f_malp,
        n_bdau: ngay_bd,
        n_kthuc: ngay_kt
    }
}
convertPhong = (opject) => {
    var khu;
    const mang = opject.split('')
    //console.log(mang);
    khu = (string)=>{
        switch (string) {
            case "A":
                return "Khu A";
                break;
            case "B":
                return "Khu B";
                break;
            case "C":
                return "Khu C";
                break;
            case "E":
                return "Khu E";
                break;
            default:
                return "null";
                break;
        }
    }
    return {
        t_phong: opject,
        khu: khu(mang[0]),
    }
}
data_gv = () => {
    //sửa định dạng dữ liệu
    const workbook = xlsx.readFile(pathGv);
    let sheetName = workbook.SheetNames[0];
    const newWorkbook = workbook;
    newWorkbook.Sheets[sheetName]['A1'].v = "msgv";
    xlsx.writeFile(workbook, './upload/convert.xls');
    //đọc file convert data
    const dataTable = xlsx.readFile('./upload/convert.xls', { cellDates: true });
    const netData = dataTable.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(netData);


    const data = jsonData.reduce((acc, item) => {
        acc.push(convertToOjectGv(item));
        return (acc);
    }, []);
    data.splice(0, 1);
    return data;
}

data_tkb = () => {
    const workbook = xlsx.readFile(pathTkb);
    let sheetName = workbook.SheetNames[0];
    const netData = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(netData);
    const data = jsonData.reduce((databeta, item) => {
        databeta.push(convertToOjectTkb(item));
        return databeta;
    }, [])
    return data;
}
data_phong = () => {
    const tkb = data_tkb();
    const allroom = new Array();
    tkb.forEach((element) => {
        if (element.phong == null) {
            element.phong = "null";
        }
        if (allroom.indexOf(element.phong) == -1) {
            allroom.push(element.phong);
        }
    });
    const data_phong = allroom.reduce((data, item)=>{
        data.push(convertPhong(item));
        return data
    }, [])
    return data_phong;
}
// console.log(typeof(data_phong()[0]))
//console.log(data_gv());



module.exports = {
    data_gv: data_gv,
    data_tkb: data_tkb,
    data_phong: data_phong
}
