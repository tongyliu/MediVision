var express = require('express');
var handlebars = require('express-handlebars');
var server = express();

var development = process.env.NODE_ENV !== 'production';
server.set('port', process.env.PORT || 4000);

server.engine('hbs', handlebars());
server.set('view engine', 'hbs');
server.set('views', __dirname + '/app');
server.use(express.static(__dirname + '/public'));

server.get('/', function(request, response) {
  var scriptPath = development ? 'bundle.js' : 'bundle.min.js';
  response.render('index', { jsFile: scriptPath });
});

server.listen(server.get('port'));
console.log('Express running at localhost:' + server.get('port'));
