var express = require('express');
var app = express();
app.use(express.logger());

var allowCrossDomain = function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.configure(function(){
  app.use(allowCrossDomain);
});


app.get('/', function (req, res) {
  res.json({message: 'hello world', success: true});
});

app.listen(3000);
console.log('Listening on port 3000\n routes supported:');
console.log('%j\n',app.routes);