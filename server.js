var express    =  require('express'),
    mongoose   =  require('mongoose'),
    http       =  require('http'),
    socketIo   =  require('socket.io'),
    bodyParser =  require('body-parser'),
    morgan     =  require('morgan');

var app = express();
var wrapperServer=http.Server(app);
var io = socketIo(wrapperServer);

app.use(express.static(__dirname+'/client'));

io.on('connection',function(socket){
  console.log('connected');
  socket.on('send message', function(message){
    console.log('Recieved:', message);
    var chat = message;
    // chat.save(function(){
      io.emit('emit message', message)
    // });
  });
});


app.get('/',function(req,res){
  res.sendFile(__dirname+'/client/index.html')
});

var port=process.env.PORT || '8080';
wrapperServer.listen(port,function(){
    console.log('started...');
});
