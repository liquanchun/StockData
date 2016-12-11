/**
 * Created by liqc on 2016-12-05.
 */
var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var cronJob = require("cron").CronJob;
var logger = require('./logger');

function startlaod(url) {
    server.download2(url, function (data) {
        if (data) {
            try {
                var d = JSON.parse(data);
                var list = d["list"];
                for(let i=0;i<list.length;i++) {
                    var item = list[i];
                    var fields = [];
                    fields.push("CODE");
                    fields.push("FIVE_MINUTE");
                    fields.push("HIGH");
                    fields.push("HS");
                    fields.push("LB");
                    fields.push("LOW");
                    fields.push("MCAP");
                    fields.push("MFRATIO2");
                    fields.push("MFRATIO10");
                    fields.push("MFSUM");
                    fields.push("NAME");
                    fields.push("OPEN");
                    fields.push("PE");
                    fields.push("PERCENT");
                    fields.push("PRICE");
                    fields.push("SNAME");
                    fields.push("SYMBOL");
                    fields.push("TCAP");
                    fields.push("TURNOVER");
                    fields.push("UPDOWN");
                    fields.push("VOLUME");
                    fields.push("WB");
                    fields.push("YESTCLOSE");
                    fields.push("ZF");
                    fields.push("NO");
                    fields.push("record_date");
                    fields.push("record_time");
                    var sqlpre = "Insert into stocktradelist(" + fields.join(',') + ") values (";
                    sqlpre += "'" + item.CODE + "',";
                    sqlpre += "'" + item.FIVE_MINUTE + "',";
                    sqlpre += "'" + item.HIGH + "',";
                    sqlpre += "'" + item.HS + "',";
                    sqlpre += "'" + item.LB + "',";
                    sqlpre += "'" + item.LOW + "',";
                    sqlpre += "'" + item.MCAP + "',";
                    sqlpre += "'" + item.MFRATIO.MFRATIO2 + "',";
                    sqlpre += "'" + item.MFRATIO.MFRATIO10 + "',";
                    sqlpre += "'" + item.MFSUM + "',";
                    sqlpre += "'" + item.NAME + "',";
                    sqlpre += "'" + item.OPEN + "',";
                    sqlpre += "'" + item.PE + "',";
                    sqlpre += "'" + item.PERCENT + "',";
                    sqlpre += "'" + item.PRICE + "',";
                    sqlpre += "'" + item.SNAME + "',";
                    sqlpre += "'" + item.SYMBOL + "',";
                    sqlpre += "'" + item.TCAP + "',";
                    sqlpre += "'" + item.TURNOVER + "',";
                    sqlpre += "'" + item.UPDOWN + "',";
                    sqlpre += "'" + item.VOLUME + "',";
                    sqlpre += "'" + item.WB + "',";
                    sqlpre += "'" + item.YESTCLOSE + "',";
                    sqlpre += "'" + item.ZF + "',";
                    sqlpre += "'" + item.NO + "',";
                    sqlpre += "'" + moment().format("YYYY-MM-DD") + "','" + moment().format("HH:mm:ss") + "')";

                    query(sqlpre, function (err, vals, fields) {
                        if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlpre);
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
}
function start() {
    new cronJob('0 38 16 * * MON-FRI', function () {
            console.log('个股交易', moment().format("YYYY-MM-DD HH:mm:ss"));
            for (let i = 0; i < 130; i++) {
                var url = "http://quotes.money.163.com/hs/service/diyrank.php?host=http%3A%2F%2Fquotes.money.163.com%2Fhs%2Fservice%2Fdiyrank.php&page=" + i.toString() + "&query=STYPE%3AEQA&fields=NO%2CSYMBOL%2CNAME%2CPRICE%2CPERCENT%2CUPDOWN%2CFIVE_MINUTE%2COPEN%2CYESTCLOSE%2CHIGH%2CLOW%2CVOLUME%2CTURNOVER%2CHS%2CLB%2CWB%2CZF%2CPE%2CMCAP%2CTCAP%2CMFSUM%2CMFRATIO.MFRATIO2%2CMFRATIO.MFRATIO10%2CSNAME%2CCODE%2CANNOUNMT%2CUVSNEWS&sort=PERCENT&order=desc&count=24&type=query";
                startlaod(url);
            }
        }
        , null, true, 'Asia/Chongqing');
}
start();
