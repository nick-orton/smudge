var http = require('http'),
httpProxy = require('http-proxy');
fs = require('fs');
rand = require('./rand')
conf = require('./conf')


console.log('loading languages');
var langs = JSON.parse(fs.readFileSync("./data/langs.json",'utf8'));
console.log('loading users');
var users = JSON.parse(fs.readFileSync("./data/users.json",'utf8'));
console.log('data loaded');

var bot_worthy = [/.*\.css/, /.*\.js/, /.*\.png/,
                  /.*\.gif/, /.*\.ico/, /.*\.jpg/,
                  /.*\.flv/, /.*\.mp3/]

function acceptLanguage() {
  var dialect = rand.choose(langs["englishes"]);
  var exotic = rand.choose(langs["exotics"]);

  if(rand.prob(6397)){
    return dialect + ",en;q=0.8";
  }
  if(rand.prob(1000)){
    return exotic + "," + dialect + ";q=0.8,en;q=0.6";
  }
  return dialect + ",en;q=0.8," + exotic + ";q=0.6";
}

function setUserAgent(req, agents){
  var agent = rand.choose(agents);
  req.headers['user-agent'] = agent;
}

function mutateHeaders(req){
  if(bot_worthy.some(function(regex){ return regex.test(req.url);})){
    setUserAgent(req, users["bots"]);
  } else {
    setUserAgent(req, users["browsers"]);
  }
  req.headers['accept-language'] = acceptLanguage();
}

httpProxy.createServer(function (req, res, proxy) {
  mutateHeaders(req);
  proxy.proxyRequest(req, res, conf.parent);
}).listen(conf.listenPort);
