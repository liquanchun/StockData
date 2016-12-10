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
    server.download(url, function (data) {
        if (data) {
            try {
                let dataArr =data.split('\n');
                let len = dataArr.length;
                for(let i=1;i<len -1;i++){
                    let valArr =dataArr[i].split(',');
                    var sqlstring = "Insert into stock_trade values";
                    sqlstring += "('"+ valArr[0]  +"','"+ valArr[1].substr(1) +"','"+ valArr[2] +"',";
                    sqlstring += valArr[3] + "," + valArr[4] + ","+ valArr[5] + ","+ valArr[6] + ","+ valArr[7] + ",";
                    sqlstring += valArr[8] + "," + valArr[9] + ","+ valArr[10] + ","+ valArr[11] + ","+ valArr[12] + ",";
                    sqlstring += valArr[13];
                    sqlstring += ")";
                    //console.log(sqlstring);
                    query(sqlstring, function (err, vals, fields) {
                       if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
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
    var sqlstring = "select distinct stock_code from hangyestockinfo where stock_code like '6%'";
    query(sqlstring, function (err, vals, fields) {
        if(vals != undefined) {
            for (let i = 0; i < vals.length; i++) {
                var url = "http://quotes.money.163.com/service/chddata.html?code=0" + vals[i].stock_code + "&start=20100101&end=20161205&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP";
                startlaod(url);
            }
        }
        if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
    });
}
start();
