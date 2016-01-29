var express = require("express");
var mysql = require("mysql");
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

module.exports = router;