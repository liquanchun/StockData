var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var cronJob = require("cron").CronJob;
var flow = require('nimble');
var logger = require("./logHelper").helper;

function start() {
    new cronJob('0 10 22 * * MON-FRI', function () {
    console.log('分级基金',moment().format("YYYY-MM-DD HH:mm:ss"));
    var url = "http://fund.eastmoney.com/fjjj_jzzzl.html";
    server.download(url, function (data) {
        if (data) {
            var $ = cheerio.load(data);
            try {
                var netdate = '', lastnetdate = '';
                $("#oTable tr").each(function (i, item) {
                    if (i === 0) {
                        netdate = $(item).children("td").eq(5).text().trim();
                        lastnetdate = $(item).children("td").eq(6).text().trim();
                    }
                    if (i >= 2) {
                        var data = {};
                        data.d0 = $(item).children("td").eq(0).text().trim();
                        data.d1 = $(item).children("td").eq(1).text().trim();
                        data.d2 = $(item).children("td").eq(2).text().trim();
                        data.d3 = $(item).children("td").eq(3).text().trim();
                        data.d4 = $(item).children("td").eq(4).text().trim().replace('行情基金吧', '');
                        data.d5 = $(item).children("td").eq(5).text().trim();
                        data.d6 = $(item).children("td").eq(6).text().trim();
                        data.d7 = $(item).children("td").eq(7).text().trim();
                        data.d8 = $(item).children("td").eq(8).text().trim();
                        data.d9 = $(item).children("td").eq(9).text().trim();
                        data.d10 = $(item).children("td").eq(10).text().trim().slice(0, -1);
                        data.d11 = $(item).children("td").eq(11).text().trim();
                        data.d12 = $(item).children("td").eq(12).text().trim().slice(0, -1);
                        var sqlstring = "Insert into fundgrading(fund_code,fund_name,net_date,unit_netvalue,total_netvalue,last_net_date,last_unit_netvalue,last_total_netvalue,change_value,change_price,market_price,discount_rate,update_time)values";
                        sqlstring += "('" + data.d3 + "','" + data.d4 + "','" + netdate + "'," + data.d5 + "," + data.d6 + ",'" + lastnetdate + "'," + data.d7 + "," + data.d8 + "," + data.d9 + "," + data.d10 + "," + data.d11 + "," + data.d12;
                        sqlstring += "," + Date.now() + ")";

                        query(sqlstring, function (err, vals, fields) {
                            if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err,sqlstring);
                        });
                        //console.log(sqlstring);
                    }
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