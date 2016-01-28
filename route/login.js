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

router.get("/", function(req, res) {
	if(req.session.user) {
		res.redirect("/index");
	}else {
		// res.render("login", {title: "Hightalk Login"});
		res.redirect("/login")
	}
});

router.route("/login")
		.get(function(req, res) {
			res.render("login", {title: "Hightalk Login"});
		})
		.post(function(req, res) {
			var str = "select * from " + TABLE_USER + " where username=\"" + req.body.username + "\" and psw=\"" + req.body.password + "\"";

			client.query(str, function(err, results) {
				if(results.length) {
					req.session.user = {};
					req.session.user.id = results[0].id;
					req.session.user.username = results[0].username;
					req.session.user.password = results[0].psw;
					req.session.user.nickname = results[0].nickname;

					res.redirect("/index");
				}else {
					req.session.user = undefined;
					res.redirect("/login");
				}
			});
		});

router.post("/login/doRegister", function(req, res) {
	var today = moment().format("YYYY-MM-DD");
	var str = "insert into " + TABLE_USER + "(nickname,username,psw,createdate) values(\"" + req.body.nickname + "\",\"" + req.body.username + "\",\"" + req.body.password + "\",\"" + today + "\")";
	console.log(str)
	client.query(str);

	res.redirect("/login");
})

module.exports = router;