var express  = require('express');
var app      = express();
var http = require('http');
var socket = require('socket.io');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); 

app.set('port', 3000)
var server = http.createServer(app);

var io = socket.listen(server);
server.listen(app.get('port'),function() {
    console.log("listening on" + " " + app.get('port'));
})

var userlist = {}

io.on('connection', function(socket){
    socket.on('name',function(name){
       io.emit('userlist-name',name);
        console.log("------------------------"+name);
        userlist[name] = socket
        socket.username = name
        console.log(socket.username);

    });

    socket.on('send-msg', function(name, msg){
        console.log('got user name' + name + " " + msg);
        targetUser = userlist[name];
        targetUser.emit('rec-msg', msg);
    });

    socket.on('disconnect', function(){
    io.emit('userleft', socket.username);
    console.log('user disconnected');
    console.log(socket.username);
    });


 });

require('./controllers/passport')(passport);

app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser()); 
app.use(express.static(__dirname + '/public'));


app.set('view engine', 'ejs'); 

app.use(session({ secret: 'i' }));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

require('./controllers/routes.js')(app, passport);

