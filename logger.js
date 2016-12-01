/**
 * Created by liqc on 2016-12-01.
 */
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/error.log', "maxLogSize": 2048000,category: 'error', },
        { type: 'file', filename: 'logs/info.log',"maxLogSize": 2048000, category: 'info' },
        { type: 'file', filename: 'logs/sql.log', "maxLogSize": 2048000,category: 'sql' }
    ]
});

var writeErr = function(msg) {
    var loggererror = log4js.getLogger('error');
    loggererror.error(msg);
}

var writeSql = function(msg) {
    var loggersql = log4js.getLogger('sql');
    loggersql.debug(msg);
}

var writeInfo = function(msg) {
    var loggerinfo = log4js.getLogger('info');
    loggerinfo.info(msg);
}

exports.writeErr = writeErr;
exports.writeSql = writeSql;
exports.writeInfo = writeInfo;