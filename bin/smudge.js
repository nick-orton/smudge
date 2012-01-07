#!/usr/bin/env node

var http = require('http'),
httpProxy = require('http-proxy');
conf = require('../conf')
smudgers = require('../lib/smudger')

smudger = smudgers.create();

console.log('')
console.log('☠☠☠ waiting for headers to smudge ☠☠☠');

httpProxy.createServer(function (req, res, proxy) {
  smudger.mutate(req);
  proxy.proxyRequest(req, res, conf.target);
}).listen(conf.listenPort);
