var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var mathext = require('./mathext');
var moment = require("moment");
var url = "http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/MoneyFlow.ssi_get_extend?id=3";
var cronJob = require("cron").CronJob;
var logger = require('./logger');

function start() {
    new cronJob('0 */15 9-16 * * MON-FRI', function () {
        console.log('市场资金流向',moment().format("YYYY-MM-DD HH:mm:ss"));
        server.download(url, function (data) {
            if (data) {
                //console.log(data);
                try {
                    var index1 = data.indexOf("|") - 1;
                    var index2 = data.indexOf(")") - 1;
                    data = data.slice(index1, index2);
                    var da = data.split(',');

                    var sqlarr = [];
                    for (var i = 0; i < da.length; i++) {
                        var d = da[i].split('|');
                        var sqlstring = "Insert into RT_Market_FundFlow(code,name,indexs,index_change,net_inflow,recode_date,recode_time,update_time)values";
                        sqlstring += "('" + d[6].slice(2) + "','" + d[3] + "'," + mathext.xround2(d[4]) + "," + mathext.xround2(d[5] * 100) + "," + mathext.xround2(d[1] / 100000000);
                        sqlstring += ",'" + moment().format("YYYY-MM-DD") + "','" + moment().format("HH:mm:ss") + "'," + Date.now() + ")";
                        sqlarr.push(sqlstring);
                    }
                    for (var i = 0; i < sqlarr.length; i++) {
                        query(sqlarr[i], function (err, vals, fields) {
                            if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err,sqlarr[i]);
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

start();
