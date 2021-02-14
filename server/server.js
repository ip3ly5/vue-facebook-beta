const express = require('express')
const cors = require('cors');
const app = express()
var jwt = require('jsonwebtoken')
var http = require('http');

app.use(cors())

let server = app.listen(80, err => {
    if(err){console.log('server cannot listen'); return}

    console.log('Server listening to port 80...')
})

var io = require("socket.io").listen(server);

let chatUsers = [];
let onlineUsers = [];
let otherArray = ['hello', 'yellow']

io.on("connection", (socket) => {
    console.log("Socket connected: ",  socket.id);
    var connectedUser = socket.handshake.query.user;
    if(!onlineUsers.includes(connectedUser)){
        onlineUsers = [...onlineUsers, connectedUser]
    }
    
    socket.on("chat_opened", function (user_id) {
        chatUsers[user_id] = socket.id;
        io.emit("chat_opened", user_id);
        console.log(chatUsers)
    });
    
    socket.on("send_message", function (data) {
        var socketId = chatUsers[data.receiver];
		socket.to(socketId).emit("message_received", data);
	});
    
    socket.on("disconnect", function () {
        console.log('user has disconnected ' + socket.id) 
        onlineUsers = onlineUsers.filter(item => item !== connectedUser)
    });
});

setInterval(function(){
    io.emit("online_users", onlineUsers);
    console.log(onlineUsers)
    
}, 5000);

process.on("uncaughtException", (err, data)=>{
    if(err){console.log('Critical error, system is still running'); return}
})

const signup = require('./routes/signup')
app.use('/signup', signup)

const login = require('./routes/login')
app.use('/login', login)

const chats = require('./routes/api/chats')
app.use('/api/chats', chats)

const user = require('./routes/api/user')
app.use('/api/user', user)

const users = require('./routes/api/users')
app.use('/api/users', users)

const posts = require('./routes/api/posts')
app.use('/api/posts', posts)


const friends = require('./routes/api/friends');
const { disconnect } = require('process');
app.use('/api/friends', friends)
