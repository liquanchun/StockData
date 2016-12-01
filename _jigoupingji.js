var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var cronJob = require("cron").CronJob;
var logger = require('./logger');

function newnotice(url,mode) {
    server.download(url, function (data) {
        if (data) {
            //console.log(data);
            try {
                var $ = cheerio.load(data);
                $("table.list_table tr").each(function (i, item) {
                    if (i === 1) {
                        var data = {};
                        data.d0 = $(item).children("td").eq(0).text().trim();
                        data.d1 = $(item).children("td").eq(1).text().trim();
                        data.d2 = $(item).children("td").eq(2).text().trim();
                        data.d3 = $(item).children("td").eq(3).text().trim();
                        data.d4 = $(item).children("td").eq(4).text().trim();
                        data.d5 = $(item).children("td").eq(5).text().trim();
                        data.d6 = $(item).children("td").eq(6).text().trim();
                        data.d7 = $(item).children("td").eq(7).text().trim();
                        data.d8 = $(item).children("td").eq(8).text().trim();

                        var sqlstring = "Insert into stockrating(stock_code,stock_name,new_rating,rating_agency,analyst,business,rating_date,last_rating,rating_mode,record_date,record_time,update_time)values";
                        sqlstring += "('" + data.d0 + "','" + data.d1 + "','" + data.d2 + "','" + data.d3 + "','" + data.d4 + "','" + data.d5 + "','" + data.d6 + "','" + data.d7 + "','" + mode + "'";
                        sqlstring += ",'" + moment().format("YYYY-MM-DD") + "','" + moment().format("HH:mm:ss") + "'," + Date.now() + ")";
                        query(sqlstring,function(err,vals,fields){
                            if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
                        });
                        //console.log(sqlstring);
                    }
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

    new cronJob('0 10 16 * * MON-FRI', function(){
            console.log('机构评级',moment().format("YYYY-MM-DD HH:mm:ss"));
            var url1 = "http://vip.stock.finance.sina.com.cn/q/go.php/vIR_RatingUp/index.phtml?p=";
            var url2 = "http://vip.stock.finance.sina.com.cn/q/go.php/vIR_RatingDown/index.phtml?p=";
            for(var i=1;i<8;i++){
                start(url1 + i,'上调');
                start(url2 + i,'下调');
            }
        }
        , null, true, 'Asia/Chongqing');
}
start();
