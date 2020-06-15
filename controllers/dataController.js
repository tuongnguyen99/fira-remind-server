const db = require('../db/db');

function listRoom(req, res){
    const pool = db.createConnection('remind_db');
    db.connect(pool);
    const query = "select * from phong";
    pool.query(query, (err, result)=>{
        if(err) throw err
        console.log(result);
    })
}
module.exports={
    listRoom
};