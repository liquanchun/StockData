/**
 * Created by Administrator on 2016/12/10.
 */
/**
 * Created by liqc on 2016-12-05.
 */
var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var cronJob = require("cron").CronJob;
var logger = require('./logger');

function startlaod(url,pagecount,leixin) {
    server.download2(url, function (data) {
        if (data) {
            try {
                var index1 = data.indexOf('(');
                var index2 = data.indexOf(')');
                var newdata = data.slice(index1+1,index2);
                var d = JSON.parse(newdata);
                if(pagecount > d.pagecount) return;
                var list = d["list"];
                for(let i=0;i<list.length;i++) {
                    var item = list[i];
                    var fields = [];
                    fields.push("CODE");
                    fields.push("HS");
                    fields.push("LB");
                    fields.push("NAME");
                    fields.push("PERCENT");
                    fields.push("PRICE");
                    fields.push("SYMBOL");
                    fields.push("TURNOVER");
                    fields.push("VOLUME");
                    fields.push("RN");
                    fields.push("record_date");
                    fields.push("record_time");
                    fields.push("leixin");
                    var sqlpre = "Insert into stocktradeamount(" + fields.join(',') + ") values (";
                    sqlpre += "'" + item.CODE + "',";
                    sqlpre += "'" + item.HS + "',";
                    sqlpre += "'" + item.LB + "',";
                    sqlpre += "'" + item.NAME + "',";
                    sqlpre += "'" + item.PERCENT + "',";
                    sqlpre += "'" + item.PRICE + "',";
                    sqlpre += "'" + item.SYMBOL + "',";
                    sqlpre += "'" + item.TURNOVER + "',";
                    sqlpre += "'" + item.VOLUME + "',";
                    sqlpre += "'" + item.RN + "',";
                    sqlpre += "'" + moment().format("YYYY-MM-DD") + "','" + moment().format("HH:mm:ss") + "','"+ leixin +"')";

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
    new cronJob('0 42 16 * * MON-FRI', function () {
            console.log('成交量骤增', moment().format("YYYY-MM-DD HH:mm:ss"));
            var ym = moment().format("MMDD");
            for(let i=0;i<10;i++) {
                ym = ym + i ;
                var url1 = "http://quotes.money.163.com/hs/realtimedata/service/turnoverupdown.php?host=/hs/realtimedata/service/turnoverupdown.php&page="+ i +"&query=upDown:1&fields=RN,SYMBOL,NAME,PRICE,LB,VOLUME,TURNOVER,HS,,PERCENT,CODE&sort=LB&order=desc&count=50&type=query&callback=callback_534099419&req=" + ym;
                startlaod(url1,i,'成交量骤增');
            }
            for(let i=0;i<10;i++) {
                ym = ym + i ;
                var url2 = " http://quotes.money.163.com/hs/realtimedata/service/turnoverupdown.php?host=/hs/realtimedata/service/turnoverupdown.php&page="+ i +"&query=upDown:-1&fields=RN,SYMBOL,NAME,PRICE,LB,VOLUME,TURNOVER,HS,,PERCENT,CODE&sort=LB&order=asc&count=25&type=query&callback=callback_1506993718&req=" + ym;
                startlaod(url2,i,'成交量骤减');
            }
        }
        , null, true, 'Asia/Chongqing');
}
start();
