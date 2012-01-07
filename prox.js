var http = require('http'),
httpProxy = require('http-proxy');
fs = require('fs');

var langs = JSON.parse(fs.readFileSync("./langs.json",'utf8'));
var users = JSON.parse(fs.readFileSync("./users.json",'utf8'));

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

function accept_language() {

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
    set_user_agent(req, users["bots"]);
  } else {
    set_user_agent(req, users["browsers"]);
  }
  req.headers['accept-language'] = accept_language();

  //console.log(req.headers['user-agent']);
  //console.log('##' +req.url)

  proxy.proxyRequest(req, res, parent);
}).listen(3129);
