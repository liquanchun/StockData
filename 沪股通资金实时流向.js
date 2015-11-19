/**
 * Created by Administrator on 2015-11-04.
 */
//沪股通资金实时流向
var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var mathext = require('./mathext');
var moment = require("moment");
var url1 = "http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=DPAB&sty=AHTZJL"
var logger = require("./logHelper").helper;
var cronJob = require("cron").CronJob;

function start() {
    new cronJob('0 */8 9-16 * * MON-FRI', function () {
        console.log('沪股通资金实时流向',moment().format("YYYY-MM-DD HH:mm:ss"));
        server.download2(url1, function (data) {
            if (data) {
                try {
                    var d = JSON.parse(data.slice(1, -1))[0];
                    //console.log(d);
                    var sub = mathext.FloatSub(130, d.split(',')[2].slice(0, -2));
                    var sqlstring = "Insert into RT_HK2SH_FundFlow(recode_date,recode_time,inflow,update_time)";
                    sqlstring += "values('" + moment().format("YYYY-MM-DD") + "','" + moment().format("HH:mm:ss") + "'," + sub + "," + Date.now() + ")";
                    query(sqlstring, function (err, vals, fields) {
                        if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
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


