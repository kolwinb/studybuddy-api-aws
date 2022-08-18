var fs = require('fs');
//mysql model
var pool = require('../../models/usermysql.js');

//var uuid = require('uuid-random')

//log module
var log = require('./log');

const properties = require('./properties');

var cert=fs.readFileSync('private.pem');           
//custom jwt module
var jwtModule = require('../lib/jwtToken');
const status = require('../lib/status');
const dbQuery = require('../lib/dbQuery');
const scope = require('../lib/apiKeys');
const api_key = scope.gamingApi.apiKey;
const api_secret = scope.gamingApi.apiSecret;

const websocket = require('/media/data/opt/nodejs/lib/node_modules/ws');

//global socket id lookup
var lookup={};


function heartbeat(){
	this.isAlive = true;
}

const updateOnlineStatus = (status,socketId) => {
	dbQuery.setSqlUpdate(dbQuery.updateOnlineStatus,[status,socketId],function(callbackOnline) {
		if (callbackOnline) {
			console.log("userid "+socketId+" updated");
			//socket.send(JSON.parse(status.stateSuccess(JSON.stringify({"description":"user status online"}))));
		} else {
			console.log("mysql error");
			//socket.send(JSON.parse(status.server()));
		}
	});					

}

const sendError = (socket, msg) => {
	const msgJson={
			"type":"ERROR",
			"payload":{
			"description":msg
			}
		}
	socket.send(JSON.stringify(msgJson));

}


const websocketServer = {
	runWebsocket:function(server) {
		
		const wss = new websocket.Server({ server });
		
		
		//var id=0;
		//var lookup={};
		wss.on('connection', (socket,req) => {
			const apiKey = req.headers["x-api-key"];
			const apiSecret = req.headers["x-api-secret"];
			const authToken = req.headers["x-token"];
			console.log("apiKey :"+apiKey+", apiSecret :"+apiSecret+", x-token :"+authToken);
			
			if (!apiKey || !apiSecret) {
				sendError(socket,'api authorization required');
			} else if ((apiKey != api_key) && (apiSecret != api_secret)) {
				sendError(socket,'Unauthorized api calling');
			} else if (!authToken) {
				sendError(socket,'token required');
			} else {
				
				/* enginx forwarded */
				const ip = req.headers['x-forwarded-for'].split(',')[0].trim();;
				console.log('A challenge user connected '+", ip :"+ip);
	
				
				socket.isAlive = true;
				socket.on('pong',heartbeat);
				//const ip = req.socket.remoteAddress;
				
				socket.on('open',function(data){
					console.log('open data'+data);
				});
		
				socket.on('message', function(data){
					console.log('data'+data);
					let jsonData;
					
					try {
						jsonData=JSON.parse(data);
					} catch (e) {
						sendError(socket, 'Wrong format');
						return;
					}
	
					//handling commands
	
					const type = jsonData.type;
	
					handleCommand[type](authToken,jsonData,socket,wss);

					console.log('socketId :'+socket.id+', message : '+ jsonData);
					//users[socket.id]=1;


				});
			
				//send online user list for every client
				console.log("socket.socket._handle.fd :"+socket._socket._handle.fd);
				setInterval(() => {
					wss.clients.forEach((client) => {
						//only socket equals for api authenticated / client != socket every client except api authentication
						if (client == socket && client.readyState === websocket.OPEN) {
							dbQuery.getSelectAll(dbQuery.whereOnlineUsers,[1],function(callbackOnline){
								//console.log("callbackOnline :"+callbackOnline);
								if (callbackOnline[0]){
									//client.send("clients socket id "+socket.id+", sql uniqid "+callbackOnline[0].gameId);
									client.send(status.sendWsData("GET-ONLINE-USERS",callbackOnline));
								} else {
									//client.send(callbackOnline);
									console.log('server error');
								}
							});
						}
					});				
				},10000);									

				
				//disconnect client after 10 seconds if network failure
				const interval = setInterval(function ping() {
					wss.clients.forEach(function each(socket) {
						if (socket.isAlive === false){
							updateOnlineStatus(2,socket.id);
							 return socket.terminate();
						}
						
						socket.isAlive = false;
						socket.ping();
					});
				},30000);
				
				//socket.send('studybuddy online chat');
				
				socket.on('close', (close) => {
					console.log('socketId : '+socket.id+' user  disconnected');
					//id--;
					clearInterval(interval);
					//delete users[socket.id];
					//update online status of the user
					updateOnlineStatus(2,socket.id);
				});
			}
		});
	}
}

const setChallenge = (authToken,data,socket,wss) => {
	//log.info("setChallenge : "+data);
	log.info("challenge requestion from "+data.payload.from+" to "+data.payload.to);
	
	//lookup[16].send("requsting....");
	
	
	wss.clients.forEach((client) => {
		//if (client == socket && client.readyState === websocket.OPEN) {
//				client.send("clients socket id "+socket.id+", sql uniqid "+callbackOnline[0].gameId);
				if (socket.id === data.payload.to) {
					client.send("challenge request from  "+socket.id+" to ");
				}

		//}
	});
	
}

const getChallenge = (authToken,data,socket,wss) => {
	log.info("broadcast massege to all clients");
	wss.clients.forEach((client) => {
		if (client == socket && client.readyState === websocket.OPEN) {
					client.send(data);
		}
	});
}

const initOnline = (authToken,data,socket) => {
	//const rtoken=data.payload.token;
	log.info('init token : '+authToken);
	jwtModule.jwtVerify(authToken,function(callback){
		if (callback) {
			jwtModule.jwtGetUserId(authToken,function(callback) {
				const userId=callback.userId;
				const uniqId=callback.uniqid;
				socket.id=userId;
				lookup[socket.id]=socket;
				lookup[socket.id].send('studybuddy websocket api');
				console.log('socketId :'+socket.id+' token userId :'+userId);

				//console.log("userid "+socket.id+" updated");

				console.log("socket.socket._handle.fd :"+socket._socket._handle.fd);
				updateOnlineStatus(1,socket.id);

			});
		} else {
			console.log('token not verified');
		}
	});
	
}

const handleCommand = {
	'INIT'	: initOnline,
	'SET-CHALLENGE' : setChallenge,
	'GET-CHALLENGE' : getChallenge
}

module.exports = websocketServer;

