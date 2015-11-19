var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var logger = require("./logHelper").helper;

function dowdatalxsz(url,lx) {
    server.download(url, function (data) {
        if (data) {
            //console.log(data);
            try {
                var $ = cheerio.load(data);
                $("tbody tr").each(function (i, item) {
                    var data = {};
                    data.d0 = $(item).children("td").eq(0).text().trim();
                    data.d1 = $(item).children("td").eq(1).text().trim();
                    data.d2 = $(item).children("td").eq(2).text().trim();
                    data.d3 = $(item).children("td").eq(3).text().trim();
                    data.d4 = $(item).children("td").eq(4).text().trim();
                    data.d5 = $(item).children("td").eq(5).text().trim();
                    data.d6 = $(item).children("td").eq(6).text().trim();
                    data.d7 = $(item).children("td").eq(7).text().trim().slice(0, -1);
                    data.d8 = $(item).children("td").eq(8).text().trim().slice(0, -1);
                    data.d9 = $(item).children("td").eq(9).text().trim();

                    var sqlstring = "Insert into SelectStock(stock_code,stock_name,close_price,high_price,low_price,rise_days,section_change,handover_rate,business,record_date,update_time,select_mode)values";
                    sqlstring += "('" + data.d1 + "','" + data.d2 + "'," + data.d3 + "," + data.d4 + "," + data.d5 + "," + data.d6 + "," + data.d7 + "," + data.d8 + ",'" + data.d9 + "'";
                    sqlstring += ",'" + moment().format("YYYY-MM-DD") + "'," + Date.now() + ",'" + lx + "')";
                    query(sqlstring, function (err, vals, fields) {
                        if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err,sqlstring);
                    });
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

function dowdatacxfl(url,lx) {
    server.download(url, function (data) {
        if (data) {
            //console.log(data);
            try {
                var $ = cheerio.load(data);
                $("tbody tr").each(function (i, item) {
                    //if (i === 0) {
                    var data = {};
                    data.d0 = $(item).children("td").eq(0).text().trim();
                    data.d1 = $(item).children("td").eq(1).text().trim();
                    data.d2 = $(item).children("td").eq(2).text().trim();
                    data.d3 = $(item).children("td").eq(3).text().trim().slice(0, -1);
                    data.d4 = $(item).children("td").eq(4).text().trim();
                    data.d5 = $(item).children("td").eq(5).text().trim();
                    data.d6 = $(item).children("td").eq(6).text().trim();
                    data.d7 = $(item).children("td").eq(7).text().trim();
                    data.d8 = $(item).children("td").eq(8).text().trim();
                    data.d9 = $(item).children("td").eq(9).text().trim();

                    var sqlstring = "Insert into SelectStock(stock_code,stock_name,price_change,close_price,trade_number,baseday_trade_number,rise_days,section_change,business,record_date,update_time,select_mode)values";
                    sqlstring += "('" + data.d1 + "','" + data.d2 + "'," + data.d3 + "," + data.d4 + ",'" + data.d5 + "','" + data.d6 + "'," + data.d7 + "," + data.d8 + ",'" + data.d9 + "'";
                    sqlstring += ",'" + moment().format("YYYY-MM-DD") + "'," + Date.now() + ",'" + lx + "')";
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

function dowdataxstp(url,lx) {
    server.download(url, function (data) {
        if (data) {
            //console.log(data);
            try {
                var $ = cheerio.load(data);
                $("tbody tr").each(function (i, item) {
                    //if (i === 0) {
                    var data = {};
                    data.d0 = $(item).children("td").eq(0).text().trim();
                    data.d1 = $(item).children("td").eq(1).text().trim();
                    data.d2 = $(item).children("td").eq(2).text().trim();
                    data.d3 = $(item).children("td").eq(3).text().trim();
                    data.d4 = $(item).children("td").eq(4).text().trim();
                    data.d5 = $(item).children("td").eq(5).text().trim();
                    data.d6 = $(item).children("td").eq(6).text().trim().slice(0, -1);
                    data.d7 = $(item).children("td").eq(7).text().trim().slice(0, -1);

                    var sqlstring = "Insert into SelectStock(stock_code,stock_name,close_price,trade_amount,trade_number,section_change,handover_rate,record_date,update_time,select_mode)values";
                    sqlstring += "('" + data.d1 + "','" + data.d2 + "'," + data.d3 + ",'" + data.d4 + "','" + data.d5 + "'," + data.d6 + "," + data.d7;
                    sqlstring += ",'" + moment().format("YYYY-MM-DD") + "'," + Date.now() + ",'" + lx + "')";
                    query(sqlstring, function (err, vals, fields) {
                        if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
                    });
                    //console.log(sqlstring);
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
function dowdataljqs(url,lx) {
    server.download(url, function (data) {
        if (data) {
            //console.log(data);
            try {
                var $ = cheerio.load(data);
                $("tbody tr").each(function (i, item) {
                    //if (i === 0) {
                    var data = {};
                    data.d0 = $(item).children("td").eq(0).text().trim();
                    data.d1 = $(item).children("td").eq(1).text().trim();
                    data.d2 = $(item).children("td").eq(2).text().trim();
                    data.d3 = $(item).children("td").eq(3).text().trim();
                    data.d4 = $(item).children("td").eq(4).text().trim();
                    data.d5 = $(item).children("td").eq(5).text().trim();
                    data.d6 = $(item).children("td").eq(6).text().trim();
                    data.d7 = $(item).children("td").eq(7).text().trim();

                    var sqlstring = "Insert into SelectStock(stock_code,stock_name,close_price,rise_days,section_change,handover_rate,business,record_date,update_time,select_mode)values";
                    sqlstring += "('" + data.d1 + "','" + data.d2 + "'," + data.d3 + ",'" + data.d4 + "','" + data.d5 + "'," + data.d6 + "," + data.d7;
                    sqlstring += ",'" + moment().format("YYYY-MM-DD") + "'," + Date.now() + ",'" + lx + "')";
                    query(sqlstring, function (err, vals, fields) {
                        if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
                    });
                    //console.log(sqlstring);
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

var cronJob = require("cron").CronJob;
//连续上涨
var lxsz = "http://data.10jqka.com.cn/rank/lxsz/field/lxts/order/desc/page/";
//持续放量
var cxfl = "http://data.10jqka.com.cn/rank/cxfl/field/count/order/desc/page/";
//向上突破
var xstp = "http://data.10jqka.com.cn/rank/xstp/board/5/order/asc/page/";
//量价齐上
var ljqs = "http://data.10jqka.com.cn/rank/ljqs/field/count/order/desc/page/";

var endurl="/ajax/1/";

function start() {
    new cronJob('0 10 17 * * MON-FRI', function () {
        console.log('强势选股,连续上涨',moment().format("YYYY-MM-DD HH:mm:ss"));
        for(var i=1;i<=25;i++){
            dowdatalxsz(lxsz + i + endurl, '连续上涨');
        }
    }, null, true, 'Asia/Chongqing');
    new cronJob('0 20 17 * * MON-FRI', function () {
        console.log('强势选股,持续放量',moment().format("YYYY-MM-DD HH:mm:ss"));
        for(var i=1;i<10;i++) {
            dowdatacxfl(cxfl + i + endurl, '持续放量');
        }
    }, null, true, 'Asia/Chongqing');
    new cronJob('0 35 17 * * MON-FRI', function () {
        console.log('强势选股,向上突破',moment().format("YYYY-MM-DD HH:mm:ss"));
        for(var i=1;i<=45;i++) {
            dowdataxstp(xstp + i + endurl, '向上突破');
        }
    }, null, true, 'Asia/Chongqing');
    new cronJob('0 40 17 * * MON-FRI', function () {
        console.log('强势选股,量价齐升',moment().format("YYYY-MM-DD HH:mm:ss"));
        for(var i=1;i<=30;i++) {
            dowdataljqs(ljqs + i + endurl, '量价齐升');
        }
    }, null, true, 'Asia/Chongqing');
}

exports.start = start;
