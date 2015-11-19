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
    new cronJob('*/5 * 13 * * MON-FRI', function () {
        console.log('主力控盘', moment().format("YYYY-MM-DD HH:mm:ss"));
        var url = "http://stockdata.stock.hexun.com/zlkp/data/syStock.ashx?count=10&stateType=down&titType=3&stype=null&page=2&callback=hxbase_json1";
        server.download(url, function (data) {
            if (data) {
                //.log(data);
                try {
                    data = data.replace("sum", "\"sum\"").replace("list", "\"list\"");
                    var index1 = data.indexOf("({") + 1;
                    var index2 = data.indexOf("})") + 1;
                    //console.log(data.slice(index1, index2));
                    var dj = JSON.parse(data.slice(index1, index2));
                    console.log(dj.list);
                    //for (var len0 = dj.data.length, k = 0; k < len0; k++) {
                    //    for (var len1 = dj.data[k]['stocks'].length, i = 0; i < len1; i++) {
                    //        for (var len2 = dj.data[k]['stocks'][i].length, j = 0; j < len2; j++) {
                    //            var sqlstring = "Insert into InvestCalendar(invest_date,import,events,stock_code,stock_name)values";
                    //            sqlstring += "('" + dj.data[k]['date'] + "','" + dj.data[k]['import'] + "','" + dj.data[k]['events'] + "','" + dj.data[k]['stocks'][i][j].code + "','" + dj.data[k]['stocks'][i][j].name + "')";
                    //            query(sqlstring, function (err, vals, fields) {
                    //                if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
                    //            });
                    //        }
                    //    }
                    //}
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