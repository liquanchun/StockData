var cheerio = require("cheerio");
var server = require("./curl");

var url = "http://data.eastmoney.com/bkzj/hgt.html"

function dowdata() {
    server.download(url, function (data) {
        if (data) {
            //console.log(data);

            var $ = cheerio.load(data);
            $("#tb_hgt tbody tr").each(function (i, item) {
                if (i === 0) {
                    //日期
                    var d0 = $(item).children("td").eq(0).text().trim();
                    //当日资金流入
                    var d1 = $(item).children("td").eq(1).text().trim().slice(0, -1);
                    //当日余额
                    var d2 = $(item).children("td").eq(2).text().trim().slice(0, -1);
                    //总余额
                    var d3 = $(item).children("td").eq(3).text().trim().slice(0, -1);
                    //当日成交净买额
                    var d4 = $(item).children("td").eq(4).text().trim().slice(0, -1);
                    //买入成交额
                    var d5 = $(item).children("td").eq(5).text().trim().slice(0, -1);
                    //卖出成交额
                    var d6 = $(item).children("td").eq(6).text().trim().slice(0, -1);
                    //上证指数
                    var d7 = $(item).children("td").eq(9).text().trim();
                    //涨跌幅
                    var d8 = $(item).children("td").eq(10).text().trim().slice(0, -1);

                    console.log(d0, d1, d2, d3, d4, d5, d6, d7, d8);
                }
            });
        } else {
            console.log("error");
        }
    });
}
var later = require('later');
later.date.localTime();

console.log("Now:"+new Date());

var sched = later.parse.recur().every(5).second(),
    t = later.setInterval(function() {
        test(5);
    }, sched);

function test(val) {
    console.log(new Date());
    console.log(val);
}
