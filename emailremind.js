function Watcher(watchDir) {
  this.watchDir = watchDir;
}

var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("SMTP", {
  host: "smtp.qq.com",
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  auth: {
    user: "350966707@qq.com",
    pass: "lenovot500"
  }
});

var events = require('events')
  , util = require('util');

util.inherits(Watcher, events.EventEmitter);

var fs = require('fs')
  , watchDir = './logs/err';

Watcher.prototype.watch = function(filename) {
  var watcher = this;
  //fs.readdir(this.watchDir, function(err, files) {
  //  if (err) throw err;
  //  for(index in files) {
  //    watcher.emit('process', files[index]);
  //  }
  //})
  watcher.emit('process', filename);
}

Watcher.prototype.start = function() {
  var watcher = this;
  var fsWatcher = fs.watch(__dirname + '/logs/err', function (event, filename) {
  });
  fsWatcher.on('change', function (event, filename) {
      watcher.watch(filename);
  });
}

var watcher = new Watcher(watchDir);
var changefile = '';
watcher.on('process', function process(file) {
  var watchFile      = this.watchDir + '/' + file;
  if(changefile == '') {
    console.log(watchFile);
    changefile = watchFile;

    fs.readFile(watchFile, 'utf8', function (err, data) {
      changefile = '';
      transport.sendMail({
        from: "350966707@qq.com",
        to: "liqc_518@163.com",
        subject: "Nodejs 抓数据发生错误",
        generateTextFromHTML: true,
        html: data
      }, function (error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log("Message sent: " + response.message);
        }
        transport.close();
      });
    });
  }
});

watcher.start();




