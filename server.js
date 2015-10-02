var express    =  require('express'),
    mongoose   =  require('mongoose'),
    http       =  require('http'),
    socketIo   =  require('socket.io'),
    bodyParser =  require('body-parser'),
    morgan     =  require('morgan'),
    request    =  require('request')
    fs         =  require('fs');



var app = express();
var wrapperServer=http.Server(app);
var io = socketIo(wrapperServer);

mongoose.connect(process.env.MONGOLAB_URI||'mongodb://localhost/dengaiping')

var CharacterSchema= new mongoose.Schema({
  character: {type:String},
  radicals: {type:Array}
});

var Character = mongoose.model('Character', CharacterSchema)
//need to fix this if statement
if(Character.find({}).mongooseCollection.collection){
  // console.log(Character.find({}));
}else{
  var char;
  // console.log(Character.find({}));
  console.log('successful fail');
  // fs.readFile('./client/files/KanRad.txt','utf8',function(err,data){
  //   if (err) {
  //    return console.log(err);
  //  }
  //   for (var i = 0; i < data.match(/^(.) : (.*)$/gm).length; i++) {
  //     char=data.match(/^(.) : (.*)$/gm)[i].match(/(.) : /m)[1];
  //     rads=data.match(/^(.) : (.*)$/gm)[i].match(/\s:\s(.*)/g)[0].split(' ');
  //     rads.shift(); rads.shift();
  //     line={
  //       character: char,
  //       radicals: rads
  //     };
  //     char = new Character(line);
  //     char.save(function(){
  //       console.log(char);
  //     });
  //   }
  // });
}



app.use(express.static(__dirname+'/client'));

io.on('connection',function(socket, response){
  console.log('connected');
  socket.on('search request', function(search){
    console.log('Searching:', search);
    console.log(encodeURIComponent(search));
    request('http://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint='+encodeURIComponent(search), function (error, response, body) {
      if (!error && response.statusCode == 200) {
        data={
          character: null,
          traditionalForm: null,
          simplifiedForm: null,
          pinYin: null,
          definition: null
        };
        if(body.match(/font size="7">(.)</)){
            data.character= body.match(/font size="7">(.)</)[1];
        }else{
          console.log(body);
        }
        data.definition= body.match(/kDefinition.*\n.*\n.*\n.*>(.*)</)[1];

        if (body.match(/kSimplifiedVariant.*\n.*\n.*\n.*(\&.*;)</)){
          data.simplifiedForm= body.match(/kSimplifiedVariant.*\n.*\n.*\n.*(\&.*;)</)[1];

        }else if (body.match(/kTraditionalVariant.*\n.*\n.*\n.*(\&.*;)</)) {
          data.traditionalForm= body.match(/kTraditionalVariant.*\n.*\n.*\n.*(\&.*;)</)[1];

        }
        if (body.match(/kHanyuPinyin.*\n.*\n.*\n.*:(.*)</)) {
          data.pinYin= body.match(/kHanyuPinyin.*\n.*\n.*\n.*:(.*)</)[1].split(', ');

        }else if (body.match(/kMandarin.*\n.*\n.*\n.*<code>(.*)</)) {
          data.pinYin= body.match(/kMandarin.*\n.*\n.*\n.*<code>(.*)</)[1].split(', ');

        }else if (body.match(/kHanyuPinlu.*\n.*\n.*\n.*(.*)\(/)) {
          data.pinYin= body.match(/kHanyuPinlu.*\n.*\n.*\n.*(.*)\(/)[1].split(', ');

        }else if (body.match(/kXHC1983.*\n.*\n.*\n.*:(.*)</)) {
          data.pinYin= body.match(/kXHC1983.*\n.*\n.*\n.*:(.*)</)[1].split(', ');

        }
        console.log(data); //why does this log the whole fucking input
        // data=JSON.parse(body)
        // console.log(data);
        io.emit('send data', data)
      }else{
        console.log('fail');
      }
    });


  });
});



app.get('/', function(req,res){


  res.sendFile(__dirname+'/client/index.html');


  console.log("get request");

});

app.get('/api/CharRads',function(req,res){
  res.sendFile(__dirname + '/client/files/KanRad.txt')
});

var port=process.env.PORT || '8080';


// app.listen(port, function(){
wrapperServer.listen(port,function(){
    console.log('started...');
});
