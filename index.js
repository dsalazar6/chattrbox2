var http = require("http");
var fs = require("fs");
var extract = require("./extract");
var wss = require("./websockets-server");

var handleError = function(err, res) {
  fs.readFile("app/error.html", function(err, data) {
    res.writeHead(404);
    res.end(data);
  });
};

var server = http.createServer(function(req, res) {
  console.log("Responding to a request.");

  var filePath = extract(req.url);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      handleError(err, res);
      return;
    } else {
      var mime = filePath.split(".").pop();
      if (mime == "html") {
        res.setHeader("Content-Type", "text/html");
      } else if (mime == "mp3") {
        res.setHeader("Content-Type", "audio/mpeg");
      } else if (mime == "pdf") {
        res.setHeader("Content-Type", "application/pdf");
      } else if (mime == "txt") {
        res.setHeader("Content-Type", "text/plain");
      } else {
        res.setHeader("Content-Type", "application/octet-stream");
      }
      res.end(data);
    }
  });
});
server.listen(3000);
