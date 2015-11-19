/**
 * Created by Administrator on 2015-11-02.
 */
var http = require("http");

// Utility function that downloads a URL and invokes
// callback with the data.
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

function download(url, callback) {
    http.get(url, function(res) {
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end',function(){
            callback(iconv.decode(bufferHelper.toBuffer(),'GBK'));
        });
    }).on("error", function() {
        callback(null);
    });
}

function download2(url, callback) {
    http.get(url, function(res) {
        var chunks = [];
        var size = 0;
        res.on('data',function(chunk){   //监听事件 传输
            chunks.push(chunk);
            size += chunk.length;
        });
        res.on('end',function(){  //数据传输完
            var data = Buffer.concat(chunks,size);
            callback(data.toString());
        });
    }).on("error", function() {
        callback(null);
    });
}

exports.download = download;
exports.download2 = download2;
