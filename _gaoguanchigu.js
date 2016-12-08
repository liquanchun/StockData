var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var logger = require('./logger');

var url = "http://data.10jqka.com.cn/financial/ggjy/field/enddate/order/desc/page/1/ajax/1/";
var cronJob = require("cron").CronJob;

function start() {
    new cronJob('0 18 9,15 * * MON-FRI', function () {
        console.log('高管持股',moment().format("YYYY-MM-DD HH:mm:ss"));
        server.download(url, function (data) {
            if (data) {
                //console.log(data);
                try {
                    var $ = cheerio.load(data);
                    $("tbody tr").each(function (i, item) {
                        var data = {};
                        data.d0 = $(item).children("td").eq(0).text().trim();
                        data.d1 = $(item).children("td").eq(1).text().trim();
                        data.d2 = $(item).children("td").eq(2).text().trim();
                        data.d3 = $(item).children("td").eq(3).text().trim();
                        data.d4 = $(item).children("td").eq(4).text().trim();
                        data.d5 = $(item).children("td").eq(5).text().trim();
                        data.d6 = $(item).children("td").eq(6).text().trim();
                        data.d7 = $(item).children("td").eq(7).text().trim();
                        data.d8 = $(item).children("td").eq(8).text().trim();
                        data.d9 = $(item).children("td").eq(9).text().trim();
                        data.d10 = $(item).children("td").eq(10).text().trim();
                        data.d11 = $(item).children("td").eq(11).text().trim();
                        data.d12 = $(item).children("td").eq(12).text().trim();
                        data.d13 = $(item).children("td").eq(13).text().trim();

                        var sqlstring = "Insert into CEOShareHold(stock_code,stock_name,changer,change_date,change_count,trade_price,change_reason,change_rate,change_last_count,ceo,ceo_salary,ceo_post,ceo_relation,update_time)values";
                        sqlstring += "('" + data.d1 + "','" + data.d2 + "','" + data.d3 + "','" + data.d4 + "','" + data.d5 + "'," + data.d6 + ",'" + data.d7 + "','" + data.d8 + "','" + data.d9 + "','" + data.d10 + "','" + data.d11 + "','" + data.d12 + "','" + data.d13 + "'";
                        sqlstring += "," + Date.now() + ")";

                        console.log(sqlstring);
                        query(sqlstring, function (err, vals, fields) {
                            if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
                        });
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

start();
