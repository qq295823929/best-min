var mysql = require('mysql');
var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'Userinfo'
});
//"select * from `user`"

var query=function(sql,callback){
    pool.getConnection(function (err,connection) {
        connection.query(sql, function (error, results, fields) {
            if (error){
                callback(error)
            }else {
                callback(results)
            }
            connection.release();
        });
    })
};


module.exports = query;