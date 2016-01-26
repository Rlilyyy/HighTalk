var express = require('express');
var path = require('path');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

var DATABASE = "testdb";
var TABLE = "user";
var client = mysql.createConnection({
	user: "root",
	password: "8605358aa"
});

client.connect();
client.query("use " + DATABASE);


app.use(express.static(path.join(__dirname, '/public/')));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(bodyParser.urlencoded({
  extended: true
}));

// app.get('/', function(req, res) {
// 	res.render("login", {title: "HighTalk Login1"});
// })

app.get('/login', function(req, res) {
	var str = "select * from " + TABLE + " where username=\"" + req.query.username + "\" and password=\"" + req.query.password + "\"";
	console.log(str)
	res.render("login", {title: "HighTalk Login"});
})

app.get('/index', function (req, res) {
	res.render("index", {title: "HighTalk首页"});
});

app.post('/login', function(req, res) {
	var str = "insert into " + TABLE + "(nickname,username,psw) values(\"" + req.body.nickname + "\",\"" + req.body.username + "\",\"" + req.body.password + "\")";
	console.log(str+"\n\n\n")
	client.query(str);
	// client.end();
	res.render("index", {title: "HighTalk首页", nickname: req.body.nickname});
});

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
