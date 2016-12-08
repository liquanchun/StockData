var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var logger = require('./logger');

var hangye1 = "http://data.10jqka.com.cn/funds/hyzjl/field/tradezdf/order/desc/page/1/ajax/1/";
var hangye2 = "http://data.10jqka.com.cn/funds/hyzjl/field/tradezdf/order/desc/page/2/ajax/1/";
var ganlian1 = "http://data.10jqka.com.cn/funds/gnzjl/field/tradezdf/order/desc/page/1/ajax/1/";
var ganlian2 = "http://data.10jqka.com.cn/funds/gnzjl/field/tradezdf/order/desc/page/2/ajax/1/";
var ganlian3 = "http://data.10jqka.com.cn/funds/gnzjl/field/tradezdf/order/desc/page/3/ajax/1/";
function dowdata(url,lx) {
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
                    var d3 = $(item).children("td").eq(3).text().trim().slice(0, -1);
                    var d4 = $(item).children("td").eq(4).text().trim();
                    var d5 = $(item).children("td").eq(5).text().trim();
                    var d6 = $(item).children("td").eq(6).text().trim();
                    var d7 = $(item).children("td").eq(7).text().trim();
                    var d8 = $(item).children("td").eq(8).text().trim();
                    var d9 = $(item).children("td").eq(9).text().trim().slice(0, -1);
                    var d10 = $(item).children("td").eq(10).text().trim();

                    var sqlstring = "Insert into RT_Business_Index(name,indexs,index_change,inflow,outflow,net_amount,company_count,lead_stock,lead_change,recode_date,recode_time,update_time,business_type)values";
                    sqlstring += "('" + d1 + "'," + d2 + "," + d3 + "," + d4 + "," + d5 + "," + d6 + "," + d7 + ",'" + d8 + "'," + d9;
                    sqlstring += ",'" + moment().format("YYYY-MM-DD") + "','" + moment().format("HH:mm:ss") + "'," + Date.now() + ",'" + lx + "')";
                    query(sqlstring, function (err, vals, fields) {
                        if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
                    });
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
}
var cronJob = require("cron").CronJob;
function start() {
    new cronJob('0 8 16 * * MON-FRI', function () {
        console.log('行业板块实时指数',moment().format("YYYY-MM-DD HH:mm:ss"));
        dowdata(hangye1, '行业资金');
        dowdata(hangye2, '行业资金');
        dowdata(ganlian1, '概念资金');
        dowdata(ganlian2, '概念资金');
        dowdata(ganlian3, '概念资金');
    }, null, true, 'Asia/Chongqing');
}

start();