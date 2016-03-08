var express = require("express");
var mysql = require("mysql");
var moment = require("moment");
var Hashids = require("hashids");
var router = express.Router();

var SALT = "fucking salt";
var DATABASE = "hightalk";
var TABLE_USER = "users";
var client = mysql.createConnection({
	user: "root",
	password: "8605358aa"
});

client.connect(function(err) {
	if(err) {
		DBhandler();
	}
});
client.query("use " + DATABASE);

var DBhandler = function() {
	client.connect(function(err) {
		if(err) {
			DBhandler();
		}
	});
}


router.get("/", function(req, res) {
	if(req.session.user) {
		res.redirect("/index");
	}else {
		res.redirect("/login")
	}
});

router.route("/login")
		.get(function(req, res) {
			if(req.session.check) {
				req.session.check = false;
				res.render("login", {title: "Hightalk Login",check: "账号或密码错误"});
			}else {
				res.render("login", {title: "Hightalk Login",check: ""});
			}
		})
		.post(function(req, res) {

			hashids = new Hashids(SALT, 16);
			// 前端提交明文密码进行加盐加密
			var psw = hashids.encodeHex(req.body.password);
			// 根据用户名和加密后的pws去数据库比较
			var str = "select * from " + TABLE_USER + " where username=\"" + req.body.username + "\" and psw=\"" + psw + "\"";

			client.query(str, function(err, results) {
				if(err) {
					console.log("注册失败");
					console.log("注册信息为:"+req.body);
				}
				if(results.length) {
					req.session.user = {};
					req.session.user.id = results[0].id;
					req.session.user.username = results[0].username;
					req.session.user.password = results[0].psw;
					req.session.user.nickname = results[0].nickname;
					
					res.redirect("/index");
				}else {
					req.session.user = undefined;
					req.session.check = true;
					res.redirect("/login");
				}
			});
		});

router.post("/login/doRegister", function(req, res) {
	var today = moment().format("YYYY-MM-DD");
	hashids = new Hashids(SALT, 16);
	var psw = hashids.encodeHex(req.body.password);
	var str = "insert into " + TABLE_USER + "(nickname,username,psw,createdate,sex) values(\"" + req.body.nickname + "\",\"" + req.body.username + "\",\"" + psw + "\",\"" + today + "\",\""+req.body.sex+"\")";
	client.query(str);

	res.redirect("/login");
});

router.get("/login/doCheck", function(req, res) {
	var username = req.query.username;
	var str = "select username from users where username=\"" + username + "\"";
	client.query(str, function(err, results) {
		if(err) {
			console.log("检查失败");
			console.log("检查信息为:"+req.query.username);
			res.send("失败");
		}
		if(results.length) {
			res.send("已存在");
		}else {
			res.send("不存在");
		}
	})
});

module.exports = router;