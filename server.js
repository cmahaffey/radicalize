var express    =  require('express'),
    mongoose   =  require('mongoose'),
    http       =  require('http'),
    socketIo   =  require('socket.io'),
    bodyParser =  require('body-parser'),
    morgan     =  require('morgan'),
    request =  require('request');

var app = express();
var wrapperServer=http.Server(app);
var io = socketIo(wrapperServer);



app.use(express.static(__dirname+'/client'));

io.on('connection',function(socket, response){
  console.log('connected');
  socket.on('send message', function(message){
    console.log('Recieved:', message);

    request('http://www.omdbapi.com/?t='+message.text+'&y=&plot=long&r=json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        data=JSON.parse(body);
        // console.log(data.Plot);
        io.emit('emit message', {text: data.Plot})
      }
    });


  });
});



app.get('/', function(req,res){


  res.sendFile(__dirname+'/client/index.html');


  console.log("get request");

});

var port=process.env.PORT || '8080';


// app.listen(port, function(){
wrapperServer.listen(port,function(){
    console.log('started...');
});
