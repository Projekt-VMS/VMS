var http = require('http'); var fs = require('fs');
const server = http.createServer(function (req, res) { res.writeHead(200, {'Content-Type': 'express.js'}); fs.createReadStream('test.html').pipe(res); })
server.listen(3000, "0.0.0.0");
console.log('Server running at port 3000!');
