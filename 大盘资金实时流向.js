/**
 * Created by Administrator on 2015-11-04.
 */
//大盘资金实时流向
var cheerio = require("cheerio");
var server = require("./curl");
var query=require("./mysql.js");
var moment = require("moment");
var flow = require('nimble');
var logger = require("./logHelper").helper;
var szzs = {};

function zhishu() {
    var url = "http://hqdigi2.eastmoney.com/EM_Quote2010NumericApplication/cache.aspx?Type=c1&Reference=flm&rt=48221039";
    server.download2(url, function (data) {
        if (data) {
            try {
                //console.log(data);
                data = data.replace("quotation", "\"quotation\"").replace("record", "\"record\"");
                var index1 = data.indexOf("{");
                var index2 = data.indexOf("}") + 1;
                var d = JSON.parse(data.slice(index1, index2));
                var darr1 = d.quotation[0].split(',');
                var darr2 = d.quotation[1].split(',');
                szzs.shdm = darr1[0];
                szzs.shzhishu = darr1[2];
                szzs.shzdf = darr1[6].slice(0, -1);

                szzs.szdm = darr2[0];
                szzs.szzhishu = darr2[2];
                szzs.szzdf = darr2[6].slice(0, -1);
                zilj();
            }
            catch(err){
                logger.writeErr(err.stack);
            }
            //console.log(szzs);
        } else {
            logger.writeErr("error",url);
        }
    });
}
function zilj() {
    var url = "http://s1.dfcfw.com/js/index.js";
    server.download(url, function (data) {
        if (data) {
            //console.log(data);
            data = data.replace("data", "\"data\"").replace("update", "\"update\"");
            var index1 = data.indexOf("{");
            var index2 = data.indexOf("}") + 1;
            try {
                var darr = JSON.parse(data.slice(index1, index2));
                var d = darr.data.split(',');
                var sqlstring = "Insert into RT_Stock_FundFlow(main_net_inflow,main_net_rate,super_net_inflow,super_net_rate,big_net_inflow,big_net_rate,middle_net_inflow,middle_net_rate,small_net_inflow,small_net_rate,sh_code,sh_index,sh_change,sz_code,sz_index,sz_change,recode_date,recode_time,update_time)values";
                sqlstring += "(" + d[0] + "," + d[1] + "," + d[2] + "," + d[3] + "," + d[4] + "," + d[5] + "," + d[6] + "," + d[7] + "," + d[8] + "," + d[9];
                sqlstring += ",'" + szzs.shdm + "'," + szzs.shzhishu + "," + szzs.shzdf + ",'" + szzs.szdm + "'," + szzs.szzhishu + "," + szzs.szzdf;
                sqlstring += ",'" + moment().format("YYYY-MM-DD") + "','" + moment().format("HH:mm:ss") + "'," + Date.now() + ")";
                //console.log(sqlstring);
                query(sqlstring, function (err, vals, fields) {
                    if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err, sqlstring);
                });
            }
            catch (err) {
                logger.writeErr(err.stack);
                logger.writeErr(data.slice(index1,index2));
            }
        } else {
            logger.writeErr("error:", url);
        }
    });
}

var cronJob = require("cron").CronJob;
function start() {

    new cronJob('0 */8 9-16 * * MON-FRI', function () {
        console.log('大盘资金实时流向',moment().format("YYYY-MM-DD HH:mm:ss"));
        zhishu();
    }, null, true, 'Asia/Chongqing');
}
exports.start = start;
