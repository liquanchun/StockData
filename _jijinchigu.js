/**
 * Created by Administrator on 2015-11-04.
 */
//沪股通资金实时流向
var cheerio = require("cheerio");
var server = require("./curl");

var query=require("./mysql.js");
var mathext = require('./mathext');
var moment = require("moment");
var logger = require('./logger');

function downdata(url) {
    server.download2(url, function (data) {
        if (data) {
            var index1 = data.indexOf('(') + 1;
            var index2 = data.indexOf(')');
            try {
                var d = JSON.parse(data.slice(index1, index2 + 1));
                var list = d["list"];
                var sqlarr = [];
                for (var i = 0; i < list.length; i++) {
                    var data = list[i];
                    var sqlstring = "Insert into fundsharehold(stock_code,stock_name,report_date,fund_number,fund_number_last,stock_number,stock_number_last,fund_value,stock_rate,update_time)";
                    sqlstring += "values('" + data['ESYMBOL'] + "','" + data['SNAME'] + "','" + data['REPORTDATE'] + "'," + data['SHULIANG'] + "," + data['SHULIANGBIJIAO'] + "," + data['GUSHU'] + "," + data['GUSHUBIJIAO'] + "," + mathext.xround2(data['SHIZHI']) + "," + mathext.xround2(data['SCSTC27'] * 100);
                    sqlstring += "," + Date.now() + ")";
                    sqlarr.push(sqlstring);
                }
                for (var i = 0; i < sqlarr.length; i++) {
                    //console.log(sqlarr[i]);
                    query(sqlarr[i], function (err, vals, fields) {
                        if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err,sqlarr[i]);
                    });
                }
            }
            catch(err){
                logger.writeErr(err.stack);
            }
        } else {
            logger.writeErr("error:" + url);
        }
    });
}

var url1 = "http://quotes.money.163.com/hs/marketdata/service/jjcgph.php?host=/hs/marketdata/service/jjcgph.php&query=start:2015-06-30;end:2015-09-30&fields=RN,SYMBOL,SNAME,REPORTDATE,SHULIANG,SHULIANGBIJIAO,GUSHU,GUSHUBIJIAO,SHIZHI,SCSTC27&sort=SHULIANG&order=desc&count=25&type=query&callback=callback_180491765&req=31529&page=";
function start(){
    for(var i = 0;i<70;i++){
        downdata(url1 + i);
    }
    //downdata(url1);
}
start();


