var express = require('express');
var proxy = require('express-http-proxy');
var app = express();

function parseCookies (request) {
  var list = {},
    rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

app.use('/api', proxy('localhost:3000', {
  forwardPath: function(req, res) {
    console.log('proxy');
    return require('url').parse(req.url).path;
  },
  decorateRequest: function(req) {
    var cookies = parseCookies(req);
    req.headers['oam-remote-user'] = cookies['oam-remote-user'];
    req.headers['oam-groups'] = '1';
    return req;
  }
}));

app.use(express.static('dist'));

var server = app.listen(3333, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('serve-dist app listening at http://%s:%s', host, port)

});
