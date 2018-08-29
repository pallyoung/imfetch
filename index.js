const http = require('http');
const https = require('https');
const URL = require('url');

function readComingMessage(comingMessaage){
    return new Promise(function(resolve,reject){
        let data = new Buffer(0);
        comingMessaage.on('data', function (chunk) {
            data = Buffer.concat([data, chunk]);
        });
        comingMessaage.on('end', function (chunk) {
           resolve(data);
        });
    });
    
}

function Response(comingMessaage,url){
    this._comingMessaage = comingMessaage;
    this.url = comingMessaage.url;
    this.type ='cros';
    this.status = comingMessaage.statusCode;
    this.ok = comingMessaage.ok;
    this.statusText = comingMessaage.statusMessage;
    this.bodyUsed = false;
}
Response.prototype = {
    constructor:Response,
    text:function(){
        if(this.bodyUsed){
            throw new Error();
        }
        this.bodyUsed = true;
        return readComingMessage(this._comingMessaage).then(function(buffer){
            return buffer.toString('utf-8');
        });
        
    },
    json:function(){
        return this.text().then(function(v){
            JSON.parse(v);
        });
        
    },
    arrayBuffer:function(){
        if(this.bodyUsed){
            throw new Error();
        }
        this.bodyUsed = true;
        return readComingMessage(this._comingMessaage);
    },
    blob:function(){
        if(this.bodyUsed){
            throw new Error();
        }
        this.bodyUsed = true;
    },
    error:function(){

    },
    clone:function(){

    },
    redirect:function(){

    }
}
function fetch(url, config) {
    if (typeof url !== 'string') {
        config = url;
        url = config.url;
    }
    if (!url) {
        throw new Error('invalid url');
    }
    config = config||{};
    let httplient;
    if (url.startsWith('https')) {
        httpClient = https;
    } else {
        httpClient = http;
    }
    return new Promise(function (resolve, reject) {
        let request = httpClient.request(URL.parse(url), function (comingMessaage) {
            if (comingMessaage.statusCode == '200') {
                resolve(new Response(comingMessaage));
            } else {
                reject(comingMessaage.statusCode);
            }
        });
        let headers = config.headers;
        if(headers){
            for(let o in headers){
                request.setHeader(o,headers[o]);
            }
        }
        request.on('error',function(){
            reject('error');
        })
        request.end(config.body);
    })

}
module.exports = fetch;