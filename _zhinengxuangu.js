var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var url = "http://comment.10jqka.com.cn/znxg/formula_stocks_pc.json?_=1446796970888";
var cronJob = require("cron").CronJob;
var logger = require("./logHelper").helper;

function start() {
    new cronJob('0 5 9,15 * * MON-FRI', function () {
        console.log('智能选股',moment().format("YYYY-MM-DD HH:mm:ss"));
        server.download(url, function (data) {
            if (data) {
                //console.log(data);
                try {
                    var index1 = data.indexOf("(") + 1;
                    var index2 = data.indexOf(")");
                    //console.log(data.slice(index1,index2));
                    var dj = JSON.parse(data.slice(index1, index2));
                    var sqlarr = [];
                    for (var item in dj) {
                        var mode = "";
                        switch (item) {
                            case "461356":
                                mode = "RSI短线超跌";
                                break;
                            case "461359":
                                mode = "BIAS短线超跌";
                                break;
                            case "461361":
                                mode = "CCI超跌1号";
                                break;
                            case "461365":
                                mode = "阶段低量";
                                break;
                            case "461379":
                                mode = "KDJ交易系统";
                                break;
                            case "461504":
                                mode = "突破压力位";
                                break;
                            case "461505":
                                mode = "明月战神";
                                break;
                            case "dtpl":
                                mode = "均线多头";
                                break;
                            case "cxg":
                                mode = "创新高";
                                break;
                            case "lxsz":
                                mode = "连续上涨";
                                break;
                        }

                        if (dj[item].list !== undefined) {
                            for (var i = 0; i < dj[item].list.length; i++) {
                                var obj = dj[item].list[i];

                                var sqlstring = "Insert into SmartSelectStock(stock_code,stock_name,new_price,price_change,today_price,last_price,recode_date,update_time,select_mode)values";
                                sqlstring += "('" + obj.code + "','" + obj.name + "'," + obj['10'] + "," + obj['199112'].replace('+', '') + "," + obj['7'] + "," + obj['6'] + ",'" + obj.date + "'";
                                sqlstring += "," + Date.now() + ",'" + mode + "')";
                                sqlarr.push(sqlstring);
                            }
                        }
                        for (var i = 0; i < sqlarr.length; i++) {
                            query(sqlarr[i], function (err, vals, fields) {
                                if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlarr[i]);
                            });
                        }
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
