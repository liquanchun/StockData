/**
 * Created by Administrator on 2015-11-09.
 */
var log4js = require('log4js');

log4js.configure({
    appenders: [
        { type: 'console' },
        {
            type: 'dateFile',
            filename: 'logs/log',
            //filename: "blah.log",
            pattern: "-yyyy-MM-dd.log",

            maxLogSize: 1024,
            // "pattern": "-yyyy-MM-dd",
            alwaysIncludePattern: true,

            backups: 4,
            category: 'dateFileLog'
        },
    ],
    replaceConsole: true
});

var logger = log4js.getLogger();

logger.info("≤‚ ‘»’∆⁄");

