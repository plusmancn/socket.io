// 初始化服务器
var app = require('express')();
var http = require('http').Server(app);
io = require('socket.io')(http); // global
var bodyParser = require('body-parser')

// App 全局配置
app.set('views','./cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(bodyParser.urlencoded({ extended: false })); // 读取请求 body 的中间件,x-www
app.use(bodyParser.json()); // 读取请求 body 的中间件,json


// 获取配置文件
var configs = require('./config/global.json');

// 初始化leanCloud
AV = require('avoscloud-sdk').AV; // global
AV.initialize(configs.applicationId, configs.applicationKey);


// app url 定义
/**
 * ?from=webpc.ue21.meet&to=mobile.ue21.meet
 */
app.get('/', function(req, res){

    var info = {
        from:req.query.from,
        to:req.query.to,
    }

    res.render('index',info);
});

/****************************************************/

var cfunc_checkIn = require('./cloud/cfunc_checkIn');
app.post('/checkIn',function(req,res){
    cfunc_checkIn.checkIn_Post(req,res);
});

/**************** ws 协议部分 *************************/

io.on('connection', function(socket){

    console.log('a user connected');

    socket.on('checkInMessage', function(msg){
        console.log(msg.to);
        // io.emit('checkInMessage', msg);
        // io.emit('checkInMessage', msg.message);
        socket.to(msg.to).emit('checkInMessage',msg.message);
    });   

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('join',function(data){
        console.log(data.from);
        socket.join(data.from);
    });

});


/****************************************************/

http.listen(8000, function(){
    console.log(configs.applicationName +' listening on *:8000');
});
