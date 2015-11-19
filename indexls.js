/**
 * Created by Administrator on 2015-11-09.
 */

var qsxg = require('./强势选股');   //* 10 17 * * MON-FRI
var zlxg = require('./智能选股');   //* 10 15 * * MON-FRI
var hgtzjlx = require('./沪股通资金流向');  //* 5 15 * * MON-FRI
var ggcg = require('./高管持股');  //* 5 9,15 * * MON-FRI
var zxgg = require('./最新公告');  //* 10 9 * * MON-FRI
var dpzs = require('./大盘指数');  //* 5 15 * * MON-FRI
var fjjj = require('./分级基金');  //* * 22 * * MON-FRI
var jjcg = require('./基金持股');  //* * 22 * * MON-FRI
var ggzjl = require('./个股资金流');
var jgpj = require('./机构评级');
var tzrl = require('./投资日历');
var zlkp = require('./主力控盘');
//qsxg.start();
//zlxg.start();
//hgtzjlx.start();
//ggcg.start();
//zxgg.start();
//dpzs.start();
//fjjj.start();
//jjcg.start();
//ggzjl.start();
//jgpj.start();
//tzrl.start();
zlkp.start();

