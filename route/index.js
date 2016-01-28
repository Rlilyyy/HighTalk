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
		try{
			client.query(str, function(err, results) {
				if(results.length) {
					res.render("index", {title: nickname, nickname: nickname, rooms: results});
				}else {
					res.render("index", {title: nickname, nickname: nickname});
				}
			})
		}catch(e) {
			client.connect();
			client.query("use " + DATABASE);
		}
		
	}else {
		res.redirect("/login");
	}
})

module.exports = router;