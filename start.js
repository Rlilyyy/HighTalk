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

http.listen(8888);

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

var onlineRooms = {};
//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

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
    console.log('a user connected');
     
    socket.on("init", function(obj) {
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
    	console.log("收到"+socket.rid)
    	if(onlineRooms[socket.rid].users[socket.uid]) {
    		delete onlineRooms[socket.rid].users[socket.uid];
	    	onlineRooms[socket.rid].userCount--;

	    	var msg = {
	    		uid: socket.uid,
	    		rid: socket.rid,
	    		nickname: socket.nickname
	    	};
	    	console.log(socket.rid)
        	io.emit("logout"+socket.rid, msg);
    	}
    	
        
        //将退出的用户从在线列表中删除
        // if(onlineUsers.hasOwnProperty(socket.name)) {
        //     //退出用户的信息
        //     var obj = {userid:socket.name, username:onlineUsers[socket.name]};
             
        //     //删除
        //     delete onlineUsers[socket.name];
        //     //在线人数-1
        //     onlineCount--;
             
        //     //向所有客户端广播用户退出
        //     io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
        //     console.log(obj.username+'退出了聊天室');
        // }
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
        // console.log(obj.username+'说：'+obj.text);
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