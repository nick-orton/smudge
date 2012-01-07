var http = require('http'),
httpProxy = require('http-proxy');
fs = require('fs');
rand = require('./rand')
conf = require('./conf')


console.log('loading languages');
var langs = JSON.parse(fs.readFileSync("./langs.json",'utf8'));
console.log('loading users');
var users = JSON.parse(fs.readFileSync("./users.json",'utf8'));
console.log('data loaded');

var bot_worthy = [/.*\.css/, /.*\.js/, /.*\.png/,
                  /.*\.gif/, /.*\.ico/, /.*\.jpg/,
                  /.*\.flv/, /.*\.mp3/]

function accept_language() {
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

function set_user_agent(req, agents){
  var agent = rand.choose(agents);
  req.headers['user-agent'] = agent;
}

httpProxy.createServer(function (req, res, proxy) {
  if(bot_worthy.some(function(regex){ return regex.test(req.url);})){
    set_user_agent(req, users["bots"]);
  } else {
    set_user_agent(req, users["browsers"]);
  }
  req.headers['accept-language'] = accept_language();

  proxy.proxyRequest(req, res, conf.parent);
}).listen(conf.listenPort);
