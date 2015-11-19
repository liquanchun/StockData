var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var url = "http://data.10jqka.com.cn/funds/ddzz/order/asc/page/1/ajax/1/";
var cronJob = require("cron").CronJob;
var logger = require("./logHelper").helper;

function start() {
    new cronJob('*/3 * 9-14 * * MON-FRI', function () {
        console.log("实时大单",moment().format("YYYY-MM-DD HH:mm:ss"));
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
                        var d4 = $(item).children("td").eq(4).text().trim();
                        var d5 = $(item).children("td").eq(5).text().trim();
                        var d6 = $(item).children("td").eq(6).text().trim();
                        var d7 = $(item).children("td").eq(7).text().trim().slice(0, -1);
                        var d8 = $(item).children("td").eq(8).text().trim();
                        var sqlstring = "Insert into RT_Big_Bill(stock_code,stock_name,trade_price,trade_number,trade_amount,bill_type,price_change,change_number,recode_date,recode_time,update_time)values";
                        sqlstring += "('" + d1 + "','" + d2 + "'," + d3 + "," + d4 + "," + d5 + ",'" + d6 + "'," + d7 + "," + d8;
                        sqlstring += ",'" + d0.split(' ')[0] + "','" + d0.split(' ')[1] + "'," + Date.now() + ")";
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

exports.start = start;