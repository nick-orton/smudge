
// The upstream proxy to which smudge will send requests.  In this example we
// are targeting a squid proxy on local host.
exports.target = {
  host: 'localhost',
  port: 3128
}

//the port to listen on
exports.listenPort = 3129;
