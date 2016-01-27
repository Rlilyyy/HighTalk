use hightalk;
create table users
(
	id int auto_increment PRIMARY KEY,
	nickname varchar(128) not null,
	username varchar(64) not null UNIQUE,
	psw varchar(128) not null,
	image varchar(256),
	synopsis varchar(128),
	createdate date not null
)auto_increment=10000;

create table rooms
(
	id int auto_increment PRIMARY KEY,
	roomname varchar(128) not null,
	image varchar(256),
	synopsis varchar(128),
	createdate date not null
)auto_increment=10000;

create table u_r
(
	uid int not null,
	rid int not null,
	id int auto_increment PRIMARY KEY,
	joindate date not null,
	FOREIGN KEY(uid) REFERENCES users(id),
	FOREIGN KEY(rid) REFERENCES rooms(id)
)auto_increment=10000;