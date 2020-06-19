const xlsx = require('xlsx');
const cvtToDateStr = require('./time');
const PATCH_GV = process.env.PATCH_GV || '../upload/CBGD.xls';
const PATCH_TKB = process.env.PATCH_GV || '../upload/tkb.xlsx';
const PATCH_CONVERT = process.env.PATCH_GV || '../upload/convert.xls';

convertToOjectGv = (opject) => {
  var phai;
  if (opject.__EMPTY_3 === "N") {
    phai = "Nữ";
  } else {
    phai = "Nam"
  }
  return {
    m_gvien: opject.msgv,
    ten: opject.__EMPTY + ' ' + opject.__EMPTY_1,
    n_sinh: cvtToDateStr(opject.__EMPTY_2),
    phai: phai,
    khoa: opject.__EMPTY_4,
    t_do: opject.__EMPTY_5,
  };
};

convertDateMysql = (arry) => {
  const date = arry.split('/').reverse();
  date[0] = 20 + date[0];
  return date.join('/');
};
convertToOjectTkb = (opject) => {
  var ngay_bd, ngay_kt, ma_gv;
  if (opject.f_tghoc == null) {
    ngay_bd = '0000-00-00';
    ngay_kt = '0000-00-00';
  } else {
    const date = opject.f_tghoc.split('-');
    ngay_bd = convertDateMysql(date[0]);
    ngay_kt = convertDateMysql(date[1]);
  }
  if (opject.f_manv == null) {
    ma_gv = null;
  } else {
    ma_gv = opject.f_manv;
  }
  return {
    thu: opject.f_thu,
    t_bdau: opject.f_tietbd,
    s_tiet: opject.f_sotiet,
    m_mon: opject.f_mamh,
    t_mon: opject.f_tenmhvn,
    m_gvien: ma_gv,
    phong: opject.f_tenph,
    lop: opject.f_malp,
    n_bdau: ngay_bd,
    n_kthuc: ngay_kt,
  };
};
convertPhong = (opject) => {
  var khu;
  const mang = opject.split('');
  //console.log(mang);
  khu = (string) => {
    switch (string) {
      case 'A':
        return 'Khu A';
        break;
      case 'B':
        return 'Khu B';
        break;
      case 'C':
        return 'Khu C';
        break;
      case 'E':
        return 'Khu E';
        break;
      default:
        return 'null';
        break;
    }
  };
  return {
    t_phong: opject,
    khu: khu(mang[0]),
  };
};
data_gv = () => {
  //sửa định dạng dữ liệu
  const workbook = xlsx.readFile(PATCH_GV);
  let sheetName = workbook.SheetNames[0];
  const newWorkbook = workbook;
  newWorkbook.Sheets[sheetName]['A1'].v = 'msgv';
  xlsx.writeFile(workbook, PATCH_CONVERT);
  //đọc file convert data
  const dataTable = xlsx.readFile(PATCH_CONVERT, { raw: true });
  const netData = dataTable.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(netData);

  const data = jsonData.reduce((acc, item) => {
    acc.push(convertToOjectGv(item));
    return acc;
  }, []);
  data.splice(0, 1);
  return data;
};

data_tkb = () => {
  const workbook = xlsx.readFile(PATCH_TKB);
  let sheetName = workbook.SheetNames[0];
  const netData = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(netData);
  const data = jsonData.reduce((databeta, item) => {
    databeta.push(convertToOjectTkb(item));
    return databeta;
  }, []);
  return data;
};
data_phong = () => {
  const tkb = data_tkb();
  const allroom = new Array();
  tkb.forEach((element) => {
    if (element.phong == null) {
      element.phong = 'null';
    }
    if (allroom.indexOf(element.phong) == -1) {
      allroom.push(element.phong);
    }
  });
  const data_phong = allroom.reduce((data, item) => {
    data.push(convertPhong(item));
    return data;
  }, []);
  return data_phong;
};
mon = (t_mon, m_mon)=>{
  return{
    t_mon:t_mon,
    m_mon:m_mon
  }
}
// console.log(typeof(data_phong()[0]))
console.log(data_tkb());
// data_Mon()
module.exports = {
  data_gv: data_gv,
  data_tkb: data_tkb,
  data_phong: data_phong,
};
