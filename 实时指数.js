/**
 * Created by Administrator on 2015-11-05.
 */
/**
 * Created by Administrator on 2015-11-04.
 */
//大盘资金实时流向
var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var cronJob = require("cron").CronJob;
var flow = require('nimble');
var logger = require("./logHelper").helper;

function start() {
    new cronJob('0 */4 9-16 * * MON-FRI', function () {
        console.log('实时指数',moment().format("YYYY-MM-DD HH:mm:ss"));
        var url = "http://hqdigi2.eastmoney.com/EM_Quote2010NumericApplication/Index.aspx?type=z&sortType=C&sortRule=-1&jsSort=1&jsName=quote_zy&ids=0000011,3990012,0003001,3990062,0000161&dt=1446691345742";
        server.download2(url, function (data) {
            if (data) {
                //console.log(data);
                try {
                    data = data.replace("quotation", "\"quotation\"");
                    var index1 = data.indexOf("{");
                    var index2 = data.indexOf("}") + 1;
                    //console.log(data.slice(index1,index2));
                    var dj = JSON.parse(data.slice(index1, index2));
                    var sqlarr = [];
                    for (var i = 0; i < dj.quotation.length; i++) {
                        var d = dj.quotation[i].split(',');
                        var sqlstring = "Insert into RT_Market_Index(code,name,lastday_index,open_index,new_index,high_index,low_index,trade_number,trade_amount,change_number,index_change,recode_date,recode_time,update_time)values";
                        sqlstring += "('" + d[1] + "','" + d[2] + "'," + d[3] + "," + d[4] + "," + d[5] + "," + d[6] + "," + d[7] + "," + d[8] + "," + d[9] + "," + d[10] + "," + d[11].slice(0, -1);
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
exports.start = start;