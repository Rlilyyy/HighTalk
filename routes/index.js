var express = require("express");
var mysql = require("mysql");
var moment = require("moment");
var router = express.Router();

var DATABASE = "hightalk";
var TABLE_USER = "users";
var client = mysql.createConnection({
	user: "root",
	password: "8605358aa"
});
client.connect();
client.query("use " + DATABASE);

router.get("/index", function(req, res) {
	if(typeof(req.session.user) != "undefined") {
		var nickname = req.session.user.nickname;
		var id = req.session.user.id;
		var str = "select rooms.id,rooms.roomname,rooms.synopsis from u_r,rooms where u_r.uid="+ id +" and u_r.rid = rooms.id; ";
		client.query(str, function(err, results) {
			if(err) {
				console.log("首页加载失败");
				console.log("加载信息为:"+req.session.user);
			}
			if(results.length) {
				res.render("index", {title: nickname, rooms: results, user: {uid: id, nickname: nickname}});
			}else {
				res.render("index", {title: nickname, nickname: nickname, user: {uid: id, nickname: nickname}});
			}
		})
		
	}else {
		res.redirect("/login");
	}
})

router.get("/index/searchrooms", function(req, res) {
	if(!req.session.user) {
		res.redirect("/login");
	}else {
		var str = "SELECT rooms.* FROM rooms WHERE NOT EXISTS (SELECT * FROM u_r WHERE u_r.uid = \"" + req.query.uid + "\" and u_r.rid=rooms.id) and rooms.roomname LIKE \"%%" + req.query.roomname + "%%\"" ;
		client.query(str, function(err, results) {
			res.render("searchrooms", {title: req.query.roomname, results: results, uid: req.session.user.id});
		})
	}
	
})

router.post("/index/addroom", function(req, res) {
	if(!req.session.user) {
		res.redirect("/login");
	}else {
		var today = moment().format("YYYY-MM-DD");
		var str = "insert into u_r(uid,rid,joindate) values (\"" + req.body.uid + "\",\"" + req.body.rid + "\",\"" + today + "\")";
		client.query(str, function(err, results) {
			if(err) {
				res.send("error");
			}else if(results.affectedRows) {
				res.send("ok");
			}
		});
	}
	
})

module.exports = router;