const http = require('http')
const kelp = require('kelp');
const etag = require('../')

const app = kelp();

app.use(etag);

app.use(function(req, res){
  res.end('hi');
});

http.createServer(app).listen(3000);
