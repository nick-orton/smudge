fs = require('fs');
rand = require('./rand')

var langs = [];
var users = [];

var bot_worthy = [/.*\.css/, /.*\.js/, /.*\.png/,
                  /.*\.gif/, /.*\.ico/, /.*\.jpg/,
                  /.*\.flv/, /.*\.mp3/]

function setUserAgent(req, agents){
  var agent = rand.choose(agents);
  req.headers['user-agent'] = agent;
}

function acceptLanguage(langs) {
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

function create(users, langs) {
  return  {
    mutate : function(req){
      if(bot_worthy.some(function(regex){ return regex.test(req.url);})){
        setUserAgent(req, users["bots"]);
      } else {
        setUserAgent(req, users["browsers"]);
      }
      req.headers['accept-language'] = acceptLanguage(langs);
    }
  }
}

exports.create = function() {
  console.log('loading languages');
  langs = JSON.parse(fs.readFileSync("./data/langs.json",'utf8'));

  console.log('loading users');
  users = JSON.parse(fs.readFileSync("./data/users.json",'utf8'));

  console.log('data loaded');
  return create(users, langs);
}
