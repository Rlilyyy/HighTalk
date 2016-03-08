(function() {
    var $ = function(id) {
        return document.getElementById(id);
    };

    var datasetFlag = typeof $("u_id").dataset != "undefined";

    var socket = io.connect();
    var userID = datasetFlag ? $("u_id").dataset.uid : $("u_id").getAttribute("data-uid");
    var roomID = -1;
    var nickname = datasetFlag ? $("u_id").dataset.nick : $("u_id").getAttribute("data-nick");
    var roomCount = 0;

    var CHAT = {
        sendMsg: function(action, msg) {
            if(action == "login") {
                socket.emit("login", msg);
            } else if(action == "message") {
                socket.emit("message", msg);
            }
        },

        updateRoomMsg: function(action, msg) {

            if(action == "init") {

                // 初次进入要获取房间所有用户列表和人数
                $("user-list").innerHTML = "<li><i class=\"icon-user\"></i>当前在线<span id=\"room-users-count\">"+msg.userCount+"</span>人</li>";
                roomCount = msg.userCount;

                for(var index in msg.users) {
                    var nickname = TOOLS.htmlEscape(msg.users[index].nickname);
                    $("user-list").innerHTML += "<li id=\""+msg.users[index].uid+"\"><div class=\"talk-users-img\"><img src=\"images/user.jpeg\" width=\"100%\" height=\"100%\"></div><span id=\"talk-users-nickname\">"+nickname+"</span></li>"
                }
            }

            if(action == "login") {
                // 如果通知的是自己的id加入了聊天室，忽略
                if(msg.uid == userID)
                    return;

                var nickname = TOOLS.htmlEscape(msg.nickname);

                roomCount++;
                // 更新好友列表和人数统计
                $("talk-chating-ul").innerHTML += "<li><div class=\"join-row\"><span class=\"join\">"+nickname+" 加入了聊天室</span></div></li>"
                $("anchor").scrollTop = $("anchor").scrollHeight;
                $("room-users-count").innerHTML = roomCount+"";
                $("user-list").innerHTML += "<li id=\""+msg.uid+"\"><div class=\"talk-users-img\"><img src=\"images/user.jpeg\" width=\"100%\" height=\"100%\"></div><span id=\"talk-users-nickname\">"+nickname+"</span></li>"
            }

            if(action == "logout") {
                if(msg.uid == userID)
                    return;

                roomCount--;

                var nickname = TOOLS.htmlEscape(msg.nickname);
                $("talk-chating-ul").innerHTML += "<li><div class=\"join-row\"><span class=\"join\">"+nickname+" 退出了聊天室</span></div></li>"
                $("room-users-count").innerHTML = roomCount;
                $("user-list").removeChild($(msg.uid+""));
                $("anchor").scrollTop = $("anchor").scrollHeight;

                // 如果有多个页面打开统一账号，只有有一个离开，其他也全都关闭
                if(msg.uid == userID)
                    socket.close();
            }
        },

        // 初次进入要通知服务器
        init: function() {
            socket.emit("init", {
                uid: userID,
                rid: roomID,
                nickname: nickname
            });
        },

        // 更换房间要重新监听
        updateRoomID: function(rid) {
            socket.removeAllListeners("message"+roomID);
            socket.removeAllListeners("login"+roomID);
            socket.removeAllListeners("logout"+roomID);
            socket.emit("logoutRoom", {});

            roomID = rid;
            $("user-list").innerHTML = "";
            $("talk-chating-ul").innerHTML = "";

            this.init();
            HANDLER.onMsgHandler();
            HANDLER.onLoginHandler();
            HANDLER.onLogoutHandler();
        },


    };

    // 按钮事件设置和需重复设置的监听事件
    var HANDLER = {
        sendBtnHandler: function() {

            var send = function() {
                var content = $("content-area").value;
                if(!!content) {
                    var msg = {
                        rid: roomID,
                        nickname: nickname,
                        content: content
                    };
                    CHAT.sendMsg("message", msg);
                    $("content-area").value = "";

                }
            };

            $("content-area").onkeydown = function(event) {
                var e = event || window.event;
                if(e && e.keyCode == 13 && !e.ctrlKey) {
                    console.log(this.value)
                    send();
                    return false;
                }
                if(e && e.keyCode == 13 && e.ctrlKey) {
                    this.value += "\n";
                }
            }

            $("btn-sending").onclick = send;
        },

        roomChoseHandler: function() {
            $("room-list").onclick = function() {
                var targetObj = event.srcElement || event.target;
                var newRoomID = datasetFlag ? targetObj.dataset.roomid : targetObj.getAttribute("data-roomid");
                CHAT.updateRoomID(newRoomID);
            }
        },

        onMsgHandler: function() {
            socket.on("message"+roomID, function(msg) {
                var nickname = TOOLS.htmlEscape(msg.nickname);
                var content = TOOLS.htmlEscape(msg.content);
                $("talk-chating-ul").innerHTML += "<li><div><span>"+nickname+"</span><span>"+content+"</span></div></li>";
                $("anchor").scrollTop = $("anchor").scrollHeight;
            });
        },

        onLoginHandler: function() {
            socket.on("login"+roomID, function(msg) {
                CHAT.updateRoomMsg("login", msg);
            });
        },

        onLogoutHandler: function() {
            socket.on("logout"+roomID, function(msg) {
                CHAT.updateRoomMsg("logout", msg);
            });
        }
    };

    var TOOLS = {
        htmlEscape: function(str) {
            return str.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, '&quot;').replace(/ /g, "&nbsp;").replace(/\n/g, "<br>");
        }
    }

    CHAT.init();
    HANDLER.sendBtnHandler();
    HANDLER.onMsgHandler();
    HANDLER.onLoginHandler();
    HANDLER.onLogoutHandler();
    HANDLER.roomChoseHandler();
    socket.on("init"+userID, function(msg) {
        CHAT.updateRoomMsg("init", msg);
    });
})();
