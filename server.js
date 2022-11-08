const express = require('./lib/node_modules/express');
const morgan = require('./lib/node_modules/morgan');
const config = require('./config.js');
//var cors = require('/media/data/opt/nodejs/lib/node_modules/cors'); //import cross-origin-resource-sharing
//url mapping
var url = require('url');
//for routes
//const websocket = require('/media/data/opt/nodejs/lib/node_modules/ws');
const app = express();
const http = require('http');
const server = http.createServer(app);
//const wss = new websocket.Server({ server });

//custom handler
const wsHandler = require("./routes/lib/websocket");
//const options = { /*....*/ };
//const io = require("/media/data/opt/nodejs/lib/node_modules/socket.io")(server,options);

/*
const http = require('http');
const server = http.createServer(app);
const { Server } = require("/media/data/opt/nodejs/lib/node_modules/socket.io");
const io = new Server (server);
*/
// get url parameters
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// morgan used to log requests on console
app.use(morgan('dev'));

//app.use(cors());

//calling to request handler (route)

//socket.io client
//app.get('/studybuddy/socketio',function(req,res){
//	res.sendFile('/home/data/opt/nodejs/studybuddy/template/socketioclient.html');
//});
app.use('/studybuddy/v1',require('./routes/v1/v1_info'));

app.get('/studybuddy/test',function(res,res){
	res.send('<h1>hello world</h1>');
});

//pdfweeklyreport
app.use('/studybuddy/v1/student/learning/pdfWeeklyReport', require('./routes/v1/v1_pdfReport'));

//mcq mining and iq mining
app.use('/studybuddy/v1/student/mining', require('./routes/v1/v1_mining'));

//buddyGame
app.use('/studybuddy/v1/student/gaming', require('./routes/v1/v1_gaming'));

//student answers
app.use('/studybuddy/v1/student/learning', require('./routes/v1/v1_learning'));


//mobile verification
app.use('/studybuddy/v1/mobile', require('./routes/v1/v1_mobileVerification'));


//studentprofile
app.use('/studybuddy/v1/profile', require('./routes/v1/v1_profile'));


//Google Oauth2
//app.use('/studybuddy/v1/googleoauth/',require('./routes/v1/v1_googleOauth2Callback'));

//RSA
app.use('/studybuddy/v1/rsa/',require('./routes/v1/rsaEncryption'));
app.use('/studybuddy/v1/rsa/',require('./routes/v1/rsaEncryption'));

//privacy links
app.use('/studybuddy/v1/pages/',require('./routes/v1/v1_pages'));


//pbkdf2 testing 
app.use('/studybuddy/v1/test_encrypt_password_pbkdf2',require('./routes/v1/test_encrypt_password_pbkdf2'));
app.use('/studybuddy/v1/test_encrypt_password_scrypt',require('./routes/v1/test_encrypt_password_scrypt'));

//aes256 encoding
app.use('/studybuddy/v1/test_aes_subscribe_data',require('./routes/v1/test_aes_subscribe_data'));
app.use('/studybuddy/v1/test_decrypt_AES_Subscribe',require('./routes/v1/test_decrypt_AES_Subscribe'));
app.use('/studybuddy/v1/test_encrypt_token_request',require('./routes/v1/test_encrypt_token_request'));


app.use('/studybuddy/v1/token',require('./routes/v1/v1_token'));
app.use('/studybuddy/v1/subscription',require('./routes/v1/v1_subscription'));
//app.use('/studybuddy/v1/subscribe_status',require('./routes/v1/v1_subscribe_status'));
app.use('/studybuddy/v1/register',require('./routes/v1/v1_register'));
app.use('/studybuddy/v1/verify',require('./routes/v1/v1_activate'));
app.use('/studybuddy/v1/authenticate',require('./routes/v1/v1_auth'));
app.use('/studybuddy/v1/session',require('./routes/v1/v1_session'));
app.use('/studybuddy/v1/vod',require('./routes/v1/v1_vod'));

wsHandler.runWebsocket(server);

//url mapping
//var ourl = req.headers.host+'/'+req.url
//console.log(ourl)
server.listen(8084, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("StudyBuddy app is Listening at http://%s:%s", host, port)
})

