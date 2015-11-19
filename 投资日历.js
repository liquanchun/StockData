/**
 * Created by Administrator on 2015-11-04.
 */
var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var cronJob = require("cron").CronJob;
var flow = require('nimble');
var logger = require("./logHelper").helper;

function start() {
    new cronJob('0 0 0 1,25 * ?', function () {
        console.log('投资日历', moment().format("YYYY-MM-DD HH:mm:ss"));
        var ym = moment().format("YYYYMM");
        var url = "http://comment.10jqka.com.cn/tzrl/getTzrlData.php?callback=callback_dt&type=data&date=" + ym;
        server.download(url, function (data) {
            if (data) {
                //console.log(data);
                try {
                    var index1 = data.indexOf("({") + 1;
                    var index2 = data.indexOf("})") + 1;
                    var dj = JSON.parse(data.slice(index1, index2));
                    for (var len0 = dj.data.length, k = 0; k < len0; k++) {
                        for (var len1 = dj.data[k]['stocks'].length, i = 0; i < len1; i++) {
                            for (var len2 = dj.data[k]['stocks'][i].length, j = 0; j < len2; j++) {
                                var sqlstring = "Insert into InvestCalendar(invest_date,import,events,stock_code,stock_name)values";
                                sqlstring += "('" + dj.data[k]['date'] + "','" + dj.data[k]['import'] + "','" + dj.data[k]['events'] + "','" + dj.data[k]['stocks'][i][j].code + "','" + dj.data[k]['stocks'][i][j].name + "')";
                                query(sqlstring, function (err, vals, fields) {
                                    if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
                                });
                            }
                        }
                    }
                }
                catch (err) {
                    logger.writeErr(err.stack);
                }
            } else {
                logger.writeErr("error:" + url);
            }
        });
    }, null, true, 'Asia/Chongqing');
}
exports.start = start;