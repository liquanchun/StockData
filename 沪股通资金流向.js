/**
 * Created by Administrator on 2015-11-04.
 */
var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var url1 = "http://data.eastmoney.com/bkzj/hgt.html"
var cronJob = require("cron").CronJob;
var logger = require("./logHelper").helper;
var moment = require("moment");
function start() {
    new cronJob('0 5 19 * * MON-FRI', function () {
        console.log("沪股通资金流向",moment().format("YYYY-MM-DD HH:mm:ss"));
        server.download(url1, function (data) {
            if (data) {
                //console.log(data);
                try {
                    var $ = cheerio.load(data);
                    var sqlarr = [];
                    $("#tb_hgt tbody tr").each(function (i, item) {
                        //if (i == 0) {     //当天数据
                            var d0 = $(item).children("td").eq(0).text().trim();
                            var d1 = $(item).children("td").eq(1).text().trim().slice(0, -1);
                            var d2 = $(item).children("td").eq(2).text().trim().slice(0, -1);
                            var d3 = $(item).children("td").eq(3).text().trim().slice(0, -1);
                            var d4 = $(item).children("td").eq(4).text().trim().slice(0, -1);
                            var d5 = $(item).children("td").eq(5).text().trim().slice(0, -1);
                            var d6 = $(item).children("td").eq(6).text().trim().slice(0, -1);
                            var d7 = $(item).children("td").eq(9).text().trim();
                            var d8 = $(item).children("td").eq(10).text().trim().slice(0, -1);

                            var insertSQL = "Insert into HK2SH_FundFlow(recode_date,inflow,blance,sum_blance,net_amount,buy_amount,sell_amount,sh_index,sh_change,update_time)";
                            insertSQL += "values('" + d0 + "'," + d1 + "," + d2 + "," + d3 + "," + d4 + "," + d5 + "," + d6 + "," + d7 + "," + d8 + "," + Date.now() + ")";

                            sqlarr.push(insertSQL);
                        //}
                    });
                    for (var i = 0; i < sqlarr.length; i++) {
                        query(sqlarr[i], function (err, vals, fields) {
                            if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlarr[i]);
                        });
                    }
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


