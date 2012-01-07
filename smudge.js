var http = require('http'),
httpProxy = require('http-proxy');
conf = require('./conf')
smudgers = require('./src/smudger')

smudger = smudgers.create();

console.log('')
console.log('☠☠☠ waiting for headers to smudge ☠☠☠');

httpProxy.createServer(function (req, res, proxy) {
  smudger.mutate(req);
  proxy.proxyRequest(req, res, conf.parent);
}).listen(conf.listenPort);
