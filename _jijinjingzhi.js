/**
 * Created by liqc on 2016-12-01.
 */
var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var url = "http://fund.eastmoney.com/fundguzhi.html";
var cronJob = require("cron").CronJob;
var logger = require('./logger');

function startlaod() {
    console.log("����ֵ",moment().format("YYYY-MM-DD HH:mm:ss"));
    server.download(url, function (data) {
        if (data) {
           // console.log(data);
            try {
                var $ = cheerio.load(data);
                $("table.dbtable tbody tr").each(function (i, item) {
                    //if (i === 0) {
                        var d2 = $(item).children("td").eq(2).text().trim();
                        var d3 = $(item).children("td").eq(3).text().trim().replace('估算图基金吧档案','');
                        var d5 = $(item).children("td").eq(5).text().trim();
                        var d7 = $(item).children("td").eq(7).text().trim();
                        var d8 = $(item).children("td").eq(8).text().trim();
                        console.log(d3.replace('估算图基金吧档案',''));
                        var sqlstring = "Insert into fundnetval(fundcode,fundname,gusuanrate,realrate,gusuanpc,recode_date,update_time)values";
                        sqlstring += "('" + d2 + "','" + d3 + "','" + d5 + "','" + d7 + "','" + d8 + "'";
                        sqlstring += ",'" + moment().format("YYYY-MM-DD") + "'," + Date.now() + ")";
                        //console.log(sqlstring);
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
function start() {
    new cronJob('0 30 23 * * MON-FRI', function () {
        startlaod();
    }, null, true, 'Asia/Chongqing');
}
start();