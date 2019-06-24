var http = require('http');
var url = require('url');
var fs = require('fs');
var dt = require('./myfirstmodule');


//create a server object:
http.createServer(function (req, res) {
  fs.readFile('../public/index1.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var q = url.parse(req.url, true).query;
    var txt = q.year + " " + q.month;
    res.write(txt + " Hello World! The date and time are currently: " + dt.myDateTime()); //write a response to the client
    res.end(); //end the response
  });
}).listen(8080); //the server object listens on port 8080
