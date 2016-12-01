var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var mathext = require('./mathext');
var moment = require("moment");
var cronJob = require("cron").CronJob;
var logger = require('./logger');

function changevalue(val){
    if(val.indexOf('亿')>0){
        return mathext.FloatMul(val.slice(0,-1),10000);
    }else{
        return val.slice(0,-1);
    }
}
function downdata(url) {
    new cronJob('0 52 16 * * MON-FRI', function () {
        console.log("个股资金流",moment().format("YYYY-MM-DD HH:mm:ss"));
        server.download(url, function (data) {
            if (data) {
                //console.log(data);
                try {
                    var $ = cheerio.load(data);
                    $("tbody tr").each(function (i, item) {
                        //if (i === 0) {
                        var d0 = $(item).children("td").eq(0).text().trim();
                        var d1 = $(item).children("td").eq(1).text().trim();
                        var d2 = $(item).children("td").eq(2).text().trim();
                        var d3 = $(item).children("td").eq(3).text().trim();
                        var d4 = $(item).children("td").eq(4).text().trim().slice(0, -1);
                        var d5 = $(item).children("td").eq(5).text().trim().slice(0, -1);
                        var d6 = $(item).children("td").eq(6).text().trim();
                        var d7 = $(item).children("td").eq(7).text().trim();
                        var d8 = $(item).children("td").eq(8).text().trim();
                        var d9 = $(item).children("td").eq(9).text().trim();
                        var d10 = $(item).children("td").eq(10).text().trim();
                        var sqlstring = "Insert into single_fundflow(stock_code,stock_name,close_price,price_change,handover_rate,inflow,outflow,net_flow,trade_amount,inflow_bigbill,record_date,record_time,update_time)values";
                        sqlstring += "('" + d1 + "','" + d2 + "'," + d3 + "," + d4 + "," + d5 + "," + changevalue(d6) + "," + changevalue(d7) + "," + changevalue(d8) + "," + changevalue(d9) + "," + changevalue(d10);
                        sqlstring += ",'" + moment().format("YYYY-MM-DD") + "','" + moment().format("HH:mm:ss") + "'," + Date.now() + ")";
                        query(sqlstring, function (err, vals, fields) {
                            if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err,sqlstring);
                        });
                        //console.log(sqlstring);
                        //}
                    });
                }
                catch(err){
                    logger.writeErr(err.stack);
                }
            } else {
                logger.writeErr("error",url);
            }
        });
    }, null, true, 'Asia/Chongqing');
}

function start(){
    var url = "http://data.10jqka.com.cn/funds/ggzjl/field/zdf/order/desc/page/";
    var urlend = "/ajax/1/";
    for(var i=1;i<52;i++){
        downdata(url + i + urlend);
    }
}
start();