var http = require('http'),
httpProxy = require('http-proxy');
fs = require('fs');


var browsers = [
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7",
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:9.0.1) Gecko/20100101 Firefox/9.0.1",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/534.52.7 (KHTML, like Gecko) Version/5.1.2 Safari/534.52.7",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:8.0) Gecko/20100101 Firefox/8.0",
  "Mozilla/5.0 (Windows NT 5.1; rv:9.0.1) Gecko/20100101 Firefox/9.0.1" ];

var bots = ["Baiduspider+(+http://www.baidu.com/search/spider_jp.html)",
            "Baiduspider+(+http://www.baidu.com/search/spider.htm)",
            "curl/7.21.2 (i386-pc-win32) libcurl/7.21.2 OpenSSL/0.9.8o zlib/1.2.5",
            "curl/7.21.0 (x86_64-apple-darwin10.2.0) libcurl/7.21.0 OpenSSL/1.0.0a zlib/1.2.5 libidn/1.19",
            "curl/7.16.3 (powerpc-apple-darwin8.0) libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
            "curl/7.16.1 (i386-pc-win32) libcurl/7.16.1 OpenSSL/0.9.8h zlib/1.2.3",
            "curl/7.7.2 (powerpc-apple-darwin6.0) libcurl 7.7.2 (OpenSSL 0.9.6b)",
            "libwww-perl/5.808",
            "libwww-perl/5.65",
            "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
            "PycURL/7.19.5",
            "PycURL/7.18.2",
            "PycURL/7.13.2",
            "Wget/1.10.1",
            "Wget/1.9.1",
            "Wget/1.8.1"
            ];

var fileContents = fs.readFileSync("./country_codes.json",'utf8');
var langs = JSON.parse(fileContents);

var bot_worthy = [/.*\.css/, /.*\.js/, /.*\.png/,
                  /.*\.gif/, /.*\.ico/, /.*\.jpg/,
                  /.*\.flv/]

var parent = {
  host: 'localhost',
  port: 3128
}

function choose(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function prob(chance) {
  return Math.floor(Math.random() * 10000) < chance;
}

function accept_language(){
  var dialect = choose(langs["englishes"]);
  var exotic = choose(langs["exotics"]);
  if(prob(6397)){
    return dialect + ",en;q=0.8";
  }
  if(prob(1000)){
    return exotic + "," + dialect + ";q=0.8,en";
  }
  return dialect + ",en;q=0.8," + exotic + ";q=0.6";
}

function set_user_agent(req, agents){
  var agent = choose(agents);
  req.headers['user-agent'] = agent;
}

httpProxy.createServer(function (req, res, proxy) {
  if(bot_worthy.some(function(regex){ return regex.test(req.url);})){
    set_user_agent(req, bots);
  } else {
    set_user_agent(req, browsers);
  }
  req.headers['accept-language'] = accept_language();

  //console.log(req.headers['user-agent']);
  //console.log('##' +req.url)

  proxy.proxyRequest(req, res, parent);
}).listen(3129);
