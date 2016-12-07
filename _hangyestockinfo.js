/**
 * Created by liqc on 2016-12-02.
 */
/**
 * Created by Administrator on 2015-11-04.
 */
//沪股通资金实时流向
var cheerio = require("cheerio");
var server = require("./curl");

var query=require("./mysql.js");
var mathext = require('./mathext');
var moment = require("moment");
var logger = require('./logger');
var urlArr = [];

function downdata(url,hangye) {
    server.download2(url, function (data) {
        if (data) {
            var index1 = data.indexOf('"data"');
            var index2 = data.indexOf('}]') + 2;
            try {
                var slicedata ="{" + data.slice(index1, index2) + "}";
                //console.log(slicedata);
                var d = JSON.parse(slicedata);
                var list = d["data"];
                var sqlarr = [];
                if(list == null || list == undefined) return;
                for (var i = 0; i < list.length; i++) {
                    var data = list[i];
                    var sqlstring = "Insert into hangyestockinfo(stock_code,hangye,update_time)";
                    sqlstring += "values('" + data['stockcode'] + "','" + hangye + "'";
                    sqlstring += "," + Date.now() + ")";
                    sqlarr.push(sqlstring);
                }
                for (var i = 0; i < sqlarr.length; i++) {
                    //console.log(sqlarr[i]);
                    query(sqlarr[i], function (err, vals, fields) {
                       if (err && err.code !== 'ER_DUP_ENTRY')  logger.writeSql(err,sqlarr[i]);
                   });
                }
            }
            catch(err){
                logger.writeErr(err.stack);
            }
        } else {
            logger.writeErr("error:" + url);
        }
    });
}

var url1 = "http://q.10jqka.com.cn/interface/stock/detail/zdf/desc/";
function start(){
    SetArr();
    for(var i = 0;i<urlArr.length;i++){
        downdata(url1 + "1/1/" + urlArr[i],urlArr[i]);
        downdata(url1 + "2/1/" + urlArr[i],urlArr[i]);
    }
}
start();

function SetArr() {
    urlArr.push('cjfw');
    urlArr.push('gt');
    urlArr.push('qczc');
    urlArr.push('ls');
    urlArr.push('sykykc');
    urlArr.push('jdjly');
    urlArr.push('fdckf');
    urlArr.push('jchx');
    urlArr.push('fzjf');
    urlArr.push('jzzs');
    urlArr.push('bxjqt');
    urlArr.push('stqc');
    urlArr.push('zq');
    urlArr.push('tysb');
    urlArr.push('ysyljg');
    urlArr.push('hgxcl');
    urlArr.push('jzcl');
    urlArr.push('zh');
    urlArr.push('gkhy');
    urlArr.push('txfw');
    urlArr.push('dl');
    urlArr.push('gltlys');
    urlArr.push('mtkc');
    urlArr.push('rqsw');
    urlArr.push('txsb');
    urlArr.push('gfjg');
    urlArr.push('yx');
    urlArr.push('yysy');
    urlArr.push('hghccl');
    urlArr.push('gj');
    urlArr.push('qclbj');
    urlArr.push('zysb');
    urlArr.push('yqkf');
    urlArr.push('nyfw');
    urlArr.push('my');
    urlArr.push('bsjd');
    urlArr.push('ncpjg');
    urlArr.push('zy');
    urlArr.push('dqsb');
    urlArr.push('hxzp');
    urlArr.push('jyqg');
    urlArr.push('zz');
    urlArr.push('jysbfw');
    urlArr.push('xcl');
    urlArr.push('yzy');
    urlArr.push('swzp');
    urlArr.push('cm');
    urlArr.push('wl');
    urlArr.push('fqcjy');
    urlArr.push('fzzz');
    urlArr.push('ylqxfw');
    urlArr.push('ylzz');
    urlArr.push('hxzy');
    urlArr.push('jsjsb');
    urlArr.push('jchy');
    urlArr.push('bzys');
    urlArr.push('qtdz');
    urlArr.push('jdjcy');
    urlArr.push('spjgzz');
    urlArr.push('bdtjyj');
    urlArr.push('gxgdz');
    urlArr.push('dzzz');
    urlArr.push('jsjyy');
    urlArr.push('hbgc');
    urlArr.push('yqyb');
    urlArr.push('zzyyly');
}



