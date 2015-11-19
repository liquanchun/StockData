//var mysql      = require('mysql');
////配置模块
//var settings = require('./settings');
////连接数据库
//var connection = mysql.createConnection(settings.db);
//
//connection.connect();
//
////查询
//var selectSQL='select * from `mytable`';
////添加
//var insertSQL='insert into mytable` (`name`)values("mary")';
////修改
//var updateSQL='update `mytable` set `name`="caton" where name="mary"';
////删除
//var deleteSQL='delete from `mytable` where `name` like "caton"';
//
////执行SQL
//connection.query(updateSQL, function(err, rows) {
//    if (err) throw err;
//});
//
////关闭连接
//connection.end();

var mysql=require("mysql");
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'fund',
    port: 3306
});

var query=function(sql,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals,fields);
            });
        }
    });
};

module.exports=query;