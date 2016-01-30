var express = require("express");
var path = require("path");
var hbs = require("hbs");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mysql = require("mysql");
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

http.listen(80, function() {
	console.log("服务器启动成功");
});

app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(session({
	secret: "bingo",
	resave: false,
	saveUninitialized:false
}));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

var loginRouter = require("./route/login");
var indexRouter = require("./route/index");

app.use(loginRouter);
app.use(indexRouter);

// 房间列表
var onlineRooms = {};

function updateOnlineRooms(obj) {
	if(!onlineRooms[obj.rid].users[obj.uid]) {
		onlineRooms[obj.rid].userCount++;
		onlineRooms[obj.rid].users[obj.uid] = {};
		var user = onlineRooms[obj.rid].users[obj.uid];
		user.uid = obj.uid;
		user.nickname = obj.nickname;
	}
}
 
io.on('connection', function(socket){
    
    socket.on("init", function(obj) {
    	console.log(obj.nickname + " connented");

    	if(onlineRooms[obj.rid]) {
    		updateOnlineRooms(obj);
    	} else {
    		onlineRooms[obj.rid] = {};
    		onlineRooms[obj.rid].userCount = 0;
    		onlineRooms[obj.rid].users = {};
    		updateOnlineRooms(obj);
    	}
    	socket.rid = obj.rid;
    	socket.uid = obj.uid;
    	socket.nickname = obj.nickname;
    	io.emit("init"+obj.uid, {
    		userCount: onlineRooms[obj.rid].userCount,
    		users: onlineRooms[obj.rid].users
    	});
    	io.emit("login"+obj.rid, {
    		uid: obj.uid,
    		nickname: obj.nickname
    	})
    });

     
    //监听用户退出
    socket.on('disconnect', function(){
    	if(onlineRooms[socket.rid].users[socket.uid]) {
    		delete onlineRooms[socket.rid].users[socket.uid];
	    	onlineRooms[socket.rid].userCount--;

	    	var msg = {
	    		uid: socket.uid,
	    		rid: socket.rid,
	    		nickname: socket.nickname
	    	};
        	io.emit("logout"+socket.rid, msg);
    	}
    });

    socket.on("logoutRoom", function() {
    	if(onlineRooms[socket.rid].users[socket.uid]) {
    		delete onlineRooms[socket.rid].users[socket.uid];
	    	onlineRooms[socket.rid].userCount--;

	    	var msg = {
	    		uid: socket.uid,
	    		rid: socket.rid,
	    	};

        	io.emit("logout"+socket.rid, msg);
    	}
    })
     
    //监听用户发布聊天内容
    socket.on('message', function(obj){
        //向所有客户端广播发布的消息
        io.emit('message'+obj.rid, obj);
    });
   
});












process.on('uncaughtException', function (err) {
   console.error('An uncaught error occurred!');
   console.error(err.stack);
 });

// var server = app.listen(8888, function () {
// 	var host = server.address().address;
// 	var port = server.address().port;

// 	console.log('Example app listening at http://%s:%s', host, port);
// });