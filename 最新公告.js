var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var cronJob = require("cron").CronJob;
var logger = require("./logHelper").helper;

function start(url,mode) {
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
                            data.d4 = $(item).children("td").eq(4).text().trim().slice(0, -1);
                            data.d5 = $(item).children("td").eq(5).text().trim();
                            data.d6 = $(item).children("td").eq(6).text().trim();
                            data.d7 = $(item).children("td").eq(7).text().trim();
                            data.d8 = $(item).children("td").eq(8).text().trim();
                            data.d9 = $(item).children("td").eq(9).text().trim();

                            var sqlstring = "Insert into newnotice(stock_code,stock_name,new_price,price_change,notices,notice_type,select_mode,record_date,update_time)values";
                            sqlstring += "('" + data.d2 + "','" + data.d3 + "'," + data.d4 + "," + data.d5 + ",'" + data.d6 + "','" + data.d8 + "','" + mode + "','" + data.d1 + "'";
                            sqlstring += "," + Date.now() + ")";
                            query(sqlstring,function(err,vals,fields){
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
function newnotice() {

    new cronJob('0 10 9 * * MON-FRI', function(){
            console.log('最新公告',moment().format("YYYY-MM-DD HH:mm:ss"));
            var url1 = "http://data.10jqka.com.cn/market/ggsd/ggtype/2/board/2/order/asc/ajax/1/page/";
            var url2 = "http://data.10jqka.com.cn/market/ggsd/ggtype/3/board/3/order/asc/ajax/1/page/";
            for(var i=1;i<7;i++){
                start(url1 + i,'利好');
                start(url2 + i,'利空');
            }
        }
        , null, true, 'Asia/Chongqing');
}
exports.start = newnotice;
