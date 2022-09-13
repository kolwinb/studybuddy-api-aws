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

//change online status when server restart
dbQuery.setUpdate(dbQuery.updateOnlineDefault,[2],function(callbackUpdate) {
	if (!callbackUpdate){
		console.log("updateOnlineDefault : database update error");
	}
});

function heartbeat(){
	this.isAlive = true;
}

const updateOnlineStatus = (status,socketId) => {
	dbQuery.setUpdate(dbQuery.updateOnlineStatus,[status,socketId],function(callbackOnline) {
		if (callbackOnline) {
			console.log("userid "+socketId+" updated");
			//socket.send(JSON.parse(status.stateSuccess(JSON.stringify({"description":"user status online"}))));
		} else {
			console.log("mysql error");
			//socket.send(JSON.parse(status.server()));
		}
	});					

}

const sendError = (socket,msg) => {
	const msgJson={
			"type":"ERROR",
			"payload":JSON.parse(msg)
		}
	try {
		socket.send(JSON.stringify(msgJson));
	} catch (e) {
		log.error("INIT required");
	}

}


const websocketServer = {
	runWebsocket:function(server) {
		
		const wss = new websocket.Server({ server });
		
		
		//var id=0;
		//var lookup={};
		wss.on('connection', (socket,req) => {
			const apiKey = req.headers["x-api-key"];
			const apiSecret = req.headers["x-api-secret"];
			var authToken = req.headers["x-token"];
			console.log("apiKey :"+apiKey+", apiSecret :"+apiSecret+", x-token :"+authToken);
			
			if (!apiKey || !apiSecret) {
				sendError(socket,status.wsAuth());
			} else if ((apiKey != api_key) || (apiSecret != api_secret)) {
				sendError(socket,status.wsUauth());
			} else if (!authToken) {
				sendError(socket,status.wsToken());
			} else {
				
				/* enginx forwarded */
				const ip = req.headers['x-forwarded-for'].split(',')[0].trim();;
				console.log('A actor connected '+", ip :"+ip);
	
				socket.isAlive = true;
				socket.on('pong',heartbeat);
				//const ip = req.socket.remoteAddress;
				
				socket.on('message', function(data){
					console.log('ws data :'+data);
					let jsonData;
					
					try {
						jsonData=JSON.parse(data);
					} catch (e) {
						sendError(socket,status.wsFormat() );
						return;
					}
	
					//handling commands
	
					const type = jsonData.type;
					//const payload = jsonData.payload;
					console.log("wss authToken :"+authToken);
					jwtModule.jwtVerify(authToken,function(callback){
						if (callback) {
							jwtModule.jwtGetUserId(authToken,function(callback) {
								var userId=callback.userId;
								var uniqId=callback.uniqId;			
								console.log("jwt uniqId :"+uniqId)
								try {
									handleCommand[type](uniqId,jsonData,socket);
								} catch (e) {
									sendError(socket,status.wsEvent());
								}
							});
						} else {
						/*
							jwtModule.jwtGetUserId(authToken,function(callback) {
								var userId=callback.userId;
								var uniqId=callback.uniqId;										
								//handleCommand['GAME-TOKEN'](uniqId,userId);
								console.log('token verification failed. userId:'+userId+' uniqid:'+uniqId);
								jwtPayload={
									userId:userId,
									uniqId:uniqId
								}
								
								
								jwtModule.jwtAuth(jwtPayload,60,function(callbackToken){
									resp=JSON.parse(callbackToken);
									const respJA = {
										type : "GAME-TOKEN",
										payload : {
										token:resp.data.token
										}
									}
									//var errorState=JSON.parse(status.wsTokenVerification());
									//errorState.data.token=callbackToken;
									authToken=resp.data.token; //assign root token
									//sendError(socket,status.wsTokenVerification());
									socket.send(JSON.stringify(respJA));			
								});
							});
						*/	
							sendError(socket,status.wsTokenVerification());
							//socket.send(JSON.stringify(tokenError));
						}								
					});
					console.log('socketId :'+socket.id+', message : '+ JSON.stringify(jsonData));
					//users[socket.id]=1;
					//toUserWebSocket = lookup[22];
					//toUserWebSocket.send("hello from 22");
					
				});


				socket.on('open',function(data){
					console.log('open data'+data);
				});
			
				//send online user list for every client
				console.log("ws.socket._handle.fd :"+socket._socket._handle.fd);
				//console.log("ws._ultron.id :"+socket._ultron.id);
				setInterval(() => {
					wss.clients.forEach((client) => {
						//only socket equals for api authenticated / client != socket every client except api authentication
						if (client == socket && client.readyState === websocket.OPEN) {
							//console.log("client id :"+client.id);
							getOnlineUsers(client);
							
							//client.send("test sending");
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
				
				socket.on('error',(error) => {
					console.log('socket error'+error);
				});
				
				socket.on('close', (close) => {
					console.log('socketId : '+socket.id+' connection has been disconnected by user');
					//id--;
					clearInterval(interval);
					//delete users[socket.id];
					//update online status of the user
					socket.terminate();
					updateOnlineStatus(2,socket.id);
				});
			}
		});
	}
}



const getOnlineUsers = (client) => {
	dbQuery.getSelectJson(dbQuery.whereOnlineUsers,[client.id,client.id],function(callbackOnline){
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

const gameEnd = (uniqId,data) => {
	log.info("GAME-END : "+JSON.stringify(data)+"uniqId : "+uniqId);
	const dateTime = new Date();
	const battleId=data.payload.battleId;
	//const userId = data["payload"]["gamerId"];
	//lookup[uniqId].send(JSON.stringify(data));
	dbQuery.getSelect(dbQuery.whereBattleStatus,[battleId],function(callbackStatus){
		//log.info("whereBattleStatus : "+callbackStatus[0].status);
		if (!callbackStatus[0]){
			try {
				sendError(lookup[uniqId],status.wsBattleNotFound());
			} catch(e) {
				log.error("INIT required");
			}
		} else {
			dbQuery.getSelectJson(dbQuery.whereBattleEnd,[battleId],function(callbackEnd) {
				players=JSON.parse(callbackEnd);
				log.info("GAME-END callbackEnd:"+JSON.stringify(players));
				if (!players[0]) {
					log.error("GAME-END : "+uniqId+" 'hasCompleted' null occured when game-finish of student");
					sendError(lookup[uniqId],status.wsFinishError());
				} else if (!players[1]){
					log.error("GAME-END : "+uniqId+" 'hasCompleted' null occured when game-finish of student");
					sendError(lookup[uniqId],status.wsFinishError());
				} else if (players){
					if ((players[0].hasCompleted == 'True') && (players[1].hasCompleted == 'True')) {
						player1Marks=players[0].correctAnswers;
						player2Marks=players[1].correctAnswers;
						log.info("players marks A & B "+player1Marks+" : "+player2Marks);
						
						if (player1Marks == player2Marks){
							log.info(players[0].name+" marks equal with "+players[1].name);
							players[0].hasWon='True';
							players[0].coins=100;
							players[1].hasWon='True';
							players[1].coins=100;
							
							dbQuery.getSelect(dbQuery.whereBattleCoin,[players[0].gamerId,battleId,'debit'],function(callbackCoin){
								if (!callbackCoin[0]){
									dbQuery.setInsert(dbQuery.insertBattleCoin,['',players[0].gamerId,battleId,'debit',100,dateTime],function(){});
								} else {
									sendError(lookup[players[0].gamerId],status.wsBattleCoin());
								}
							});
							
							dbQuery.getSelect(dbQuery.whereBattleCoin,[players[1].gamerId,battleId,'debit'],function(callbackCoin){
								if (!callbackCoin[0]){
								dbQuery.setInsert(dbQuery.insertBattleCoin,['',players[1].gamerId,battleId,'debit',100,dateTime],function(){});
								} else {
									sendError(lookup[players[1].gamerId],status.wsBattleCoin());
								}
							});
	
							
						} else if (player1Marks > player2Marks) {
							log.info(players[0].name+" WON");
							players[0].hasWon='True';
							players[0].coins=100;
							players[1].hasWon='False';
							players[1].coins=0;
	
							dbQuery.getSelect(dbQuery.whereBattleCoin,[players[0].gamerId,battleId,'debit'],function(callbackCoin){
								if (!callbackCoin[0]){
									dbQuery.setInsert(dbQuery.insertBattleCoin,['',players[0].gamerId,battleId,'debit',100,dateTime],function(){});
								} else {
									sendError(lookup[players[0].gamerId],status.wsBattleCoin());
								}
							});
													
						} else if (player2Marks > player1Marks) {
							log.info(players[1].name+" WON");
							players[1].hasWon='True';
							players[1].coins=100;
							players[0].hasWon='False';
							players[0].coins=0;
	
							dbQuery.getSelect(dbQuery.whereBattleCoin,[players[1].gamerId,battleId,'debit'],function(callbackCoin){
								if (!callbackCoin[0]){
									dbQuery.setInsert(dbQuery.insertBattleCoin,['',players[1].gamerId,battleId,'debit',100,dateTime],function(){});
								} else {
									sendError(lookup[players[1].gamerId],status.wsBattleCoin());
								}
							});						
						
						} else if (player2Marks == 0 &&  player1Marks == 0) {
							log.info(players[1].name+"Both lose");
							players[1].hasWon='False';
							players[1].coins=0;
							players[0].hasWon='False';
							players[0].coins=0;
						}
					
						//update battle finish state
						dbQuery.setUpdate(dbQuery.updateGameStatus,['finish',battleId],function(callbackFinish){
							if (callbackFinish){
								const respJ = {
											"type":"GAME-RESULT",
											payload: players
										}
								lookup[players[0].gamerId].send(JSON.stringify(respJ));
								lookup[players[1].gamerId].send(JSON.stringify(respJ));
							} else {
								sendError(lookup[uniqId],status.wsSystemError());
							}
						});
					} else {
					
						sendError(lookup[uniqId],status.wsBattleNotFinish());
					}
				}
			});
		
		}
	});
}				

const setAnswer = (uniqId,data) => {
	const userId=uniqId;
	const battleId = data.payload.battleId;
	const questionId = data.payload.questionId;
	const optionId = data.payload.optionId;
	const startedAt = data.payload.startedAt;
	const endedAt = data.payload.endedAt;
	
	console.log("setAnswer : uniqid :"+uniqId+" : "+data);
	
	dbQuery.getSelect(dbQuery.whereBattleAnswer,[userId,questionId,battleId],function(callbackBattle){
		if (!callbackBattle[0]){
			log.info("sent answers without creating battle, misbehaviour");
		} else if  (callbackBattle[0].status) {
			dbQuery.getAnswerInsertId(dbQuery.insertBattleAnswer,['',userId,battleId,questionId,optionId,startedAt,endedAt],function(callbackInsertId){
				if(callbackInsertId){
					const respJ = {
							"type":"ANS-RESULT",
							payload: {
								status:"success",
								battleId:battleId,
								questionId:questionId
							}
						}
					lookup[userId].send(JSON.stringify(respJ));
				}
			});
		} else {
			const respJ = {
					"type":"ANS-RESULT",
					payload:{
						status:"error",
						description:"prohibited action occured",
						battleId:battleId,
						questionId:questionId
					}
				}
			try {
				lookup[userId].send(JSON.stringify(respJ));
			} catch (e) {
				log.error("INIT required");
			}
		}
	});
}				

//return json object
const gameReqFrom = (user1id,user2id,data,battleId) => {
	 const jsonData= {
		type : "GAME-REQ",
		payload : {
		from : user1id,
		name : data.payload.name,
		avatarId : data.payload.avatarId,						
		battleId : battleId
		//battleId : callbackStatus[0].id
		}
	}
	try {
		lookup[user2id].send(JSON.stringify(jsonData));
	} catch(e) {
		log.error("Before gameReq, INIT required");
		
	}		
}

const gameReqResp=(user1id,user2id,data,battleId)=> {
	const respJA = {
		type : "RESP-GAME-REQ",
		payload : {
		//from : user1id,
		to : user2id,
		//name : data.payload.name,
		//avatarId : data.payload.avatarId,
		battleId : battleId
		}
	}										
	try {
		lookup[user1id].send(JSON.stringify(respJA));
	} catch (e) {
		log.error("INIT event required");
	}																	
}

const gameReq = (uniqId,data) => {
	log.info("setChallenge : "+data);
	log.info("challenge requestion from "+data.payload.from+" to "+data.payload.to);
	const dateTime = new Date();
	//user1id=data.payload.from;
	user1id=uniqId;
	user2id=data.payload.to;
	//const userId = data.payload.to;
		dbQuery.getSelect(dbQuery.whereLessCoin,[user1id],function(callbackLessCoin){
			if (!callbackLessCoin[0]) {
				sendError(lookup[user1id],status.wsUserNotFound());
			} else if (callbackLessCoin[0].balance < properties.gameCoinMin) {
				sendError(lookup[user1id],status.wsLessFund());
			} else {
				dbQuery.getSelect(dbQuery.whereLessCoin,[user2id],function(callbackLessCoin){
					if (!callbackLessCoin[0]) {
						sendError(lookup[user1id],status.wsReqUserNotFound());
					} else if (callbackLessCoin[0].balance < properties.gameCoinMin) {
						sendError(lookup[user1id],status.wsReqLessFund());
					} else {			
						dbQuery.getSelect(dbQuery.whereGameReq,[user1id,user2id,'waiting'],function(callbackStatus){
							//console.log("gameReq battlepool : "+callbackStatus[0].status);
				 			//if ((!callbackStatus[0]) || (callbackStatus[0].status != 'waiting') || (callbackStatus[0].status=='cancel' || callbackStatus[0].status=='finish'))  {
				 			//if ((!callbackStatus[0]) || (callbackStatus[0].status !== 'waiting') || (callbackStatus[0].status !== 'running'))  {
				 			if (!callbackStatus[0])  {
								dbQuery.getAnswerInsertId(dbQuery.insertGameReq,['',user1id,user2id,'waiting',dateTime],function(callbackInsertId) {
									if (!callbackInsertId){
										console.log("insertGameReq database error");
									} else {
										//send reques to actorB
										gameReqFrom(user1id,user2id,data,callbackInsertId);
										//send request status to actor A
										gameReqResp(user1id,user2id,data,callbackInsertId);	
									}
								});
							} else if (callbackStatus[0].status=='waiting') {
								//send reques to actorB
								gameReqFrom(user1id,user2id,data,callbackStatus[0].id);
								//send request status to actor A
								gameReqResp(user1id,user2id,data,callbackStatus[0].id);
							}
						});
					}
				});
			}
		});
}

const gameAccept = (uniqId,data) => {
	log.info("gameAccept :"+JSON.stringify(data));
	const dateTime = new Date();
	user1id=data.payload.to;
	//user2id=data.payload.from;
	user2id=uniqId;;
	battleId=data.payload.battleId;
	gradeId=data.payload.gradeId;
	//const userId = data.payload.to;
	log.info("gameAccept battleId :"+battleId+", user1id : "+user1id+", user2id : "+user2id);
	dbQuery.getSelect(dbQuery.whereBattleGameReq,[battleId],function(callbackWaiting){
		if (!callbackWaiting[0]) {
			log.error("Game Accept wrong battleId request found");
		} else if (callbackWaiting[0].status=='waiting') {
			dbQuery.setUpdate(dbQuery.updateGameReq,['running',dateTime,user1id,user2id,battleId],function(callbackUpdate) {
				if (!callbackUpdate){
					console.log("insertGameReq database error");
				} else {
					/* send response */
					const respJ = {
						type : "GAME-RESP",
						payload : {
						from : user2id,
						//to : user1id,
						name : data.payload.name,
						avatarId : data.payload.avatarId,
						status : "accept",
						battleId : battleId
						}
					}
					lookup[user1id].send(JSON.stringify(respJ));
					
					dbQuery.getMiningMcqStage9List(dbQuery.whereMiningMcqStage9List,[gradeId],function(callbackMcq){
					//dbQuery.getMiningMcqList(dbQuery.whereMiningMcqList,[gradeId,7],function(callbackMcq){
						if (callbackMcq){
							//console.log("stage9 mcqs :"+JSON.stringify(callbackMcq));
							const respMcq = {
								type : "GAME-BEGIN",
								payload : {
									battleId:battleId,
									mcq:JSON.parse(callbackMcq)
									}
								}
							lookup[user1id].send(JSON.stringify(respMcq));
							lookup[user2id].send(JSON.stringify(respMcq));
							
							
						}
					});
					
					//add user1id coin to coin_pool
					dbQuery.setInsert(dbQuery.insertBattleCoin,['',user1id,battleId,'credit',-1 * properties.battleCoin,dateTime],function(callbackCoin){
						if (callbackCoin){
							console.log("Coin Pool : "+user1id+" "+properties.battleCoin+" added");
						} else {
							console.log("coin pool insert error");
						}						
					});
					
					//add user2id coin to coin_pool
					dbQuery.setInsert(dbQuery.insertBattleCoin,['',user2id,battleId,'credit',-1 * properties.battleCoin,dateTime],function(callbackCoin){
						if (callbackCoin){
							console.log("Coin Pool : "+user2id+" "+properties.battleCoin+" added");
						} else {
							console.log("coin pool insert error");
						}
					});					
				}
			});
		} else {
			sendError(lookup[user2id],status.wsBattleNotFound());
		}
	});
		
}

//battle cancel and game cancel
const gameRespTo = (user1id,user2id,data,battleId) => {
	const respJ = {
		type : "GAME-RESP",
		payload : {
		//from : user1id,
		to : user2id,
		name : data.payload.name,
		avatarId : data.payload.avatarId,
		status : "cancel",
		battleId : battleId
		}
	}
	try {
		lookup[user1id].send(JSON.stringify(respJ));
	} catch (e) {
		log.error("INIT event required");
	}									
}

const gameRespFrom = (user1id,user2id,data,battleId) => {
	const respJ = {
		type : "GAME-RESP",
		payload : {
		from : user1id,
		//to : user1id,
		name : data.payload.name,
		avatarId : data.payload.avatarId,
		status : "cancel",
		battleId : battleId
		}
	}
	try {
		lookup[user2id].send(JSON.stringify(respJ));
	} catch (e) {
		log.error("INIT event required");
	}									
}


const updateSQL = (user1id,user2id,data,cancelStatus) => {
	const dateTime = new Date();
	battleId=data.payload.battleId;
	dbQuery.getSelect(dbQuery.whereBattleGameReq,[battleId],function(callbackWaiting){
		if (!callbackWaiting[0]){
			console.log("gameCancel : rows notfound in the whereBattleGameReq");
		} if (callbackWaiting[0].status == 'waiting') {
			dbQuery.setUpdate(dbQuery.updateGameReq,['cancel',dateTime,user1id,user2id,battleId],function(callbackUpdate) {
				if (!callbackUpdate){
					console.log("insertGameReq database error");
				} else {
					if (cancelStatus == 'battleCancel') {
						gameRespFrom(user1id,user2id,data,battleId);
						gameRespTo(user1id,user2id,data,battleId);
					} else if (cancelStatus == 'gameCancel') {
						gameRespFrom(user2id,user1id,data,battleId);
						gameRespTo(user2id,user1id,data,battleId);					
					}
					/*
					const respJA = {
						type : "GAME-RESP",
						payload : {
						//from : user2id,
						to : user1id,
						name : data.payload.name,
						avatarId : data.payload.avatarId,
						status : "cancel",
						battleId : battleId
						}
					}
					lookup[user2id].send(JSON.stringify(respJA));
	
					const respJA = {
						type : "GAME-RESP",
						payload : {
						from : user2id,
						//to : user1id,
						name : data.payload.name,
						avatarId : data.payload.avatarId,
						status : "cancel",
						battleId : battleId
						}
					}
					lookup[user1id].send(JSON.stringify(respJA));
					*/
					
				}
			});
		} else {
			const respJ = {
				type : "ERROR",
				payload : {
				description : "Battle not found",
				}
			}		
			lookup[user1id].send(JSON.stringify(respJ));
		}
	});
}

const battleCancel = (uniqId,data) => {
	log.info("broadcast massege to all clients");
	user2id=data.payload.to;
	user1id=uniqId;
	//user2id=data.payload.from;
	//battleId=data.payload.battleId;
	//const userId = data.payload.to;
	updateSQL(user1id,user2id,data,'battleCancel');
	
}

const gameCancel = (uniqId,data) => {
	log.info("broadcast massege to all clients");
	const dateTime = new Date();
	user1id=data.payload.to;
	user2id=uniqId;
	//user2id=data.payload.from;
	//battleId=data.payload.battleId;
	//const userId = data.payload.to;
	updateSQL(user1id,user2id,data,'gameCancel');
}

const gameResp = (uniqId,data) => {
	log.info("broadcast massege to all clients");
}



const initOnline = (uniqId,data,socket) => {
				socket.id=uniqId;
				lookup[socket.id]=socket;
				lookup[socket.id].send('studybuddy websocket server V1');
				console.log("initOnline : uniqId "+uniqId+" data :"+data);
				//update online status
				updateOnlineStatus('online',socket.id);
}

/*
const setGameToken = (uniqId,userId) => {
	jwtPayload={
		userId:uniqId,
		uniqId:userId
	}
	jwtToken.jwtAuth(jwtPayload,60,function(callbackToken){
		const respJA = {
			type : "GAME-TOKEN",
			payload : {
			//to : user1id,
			}
//		socket.send(callbackToken)			
	});

}
*/
const handleCommand = {
	'INIT'	: initOnline,
	'GAME-REQ' : gameReq,
	'GAME-ACCEPT' : gameAccept,
	'GAME-CANCEL' : gameCancel,
	'BATTLE-CANCEL' : battleCancel,
	'GAME-RESP' : gameResp,
	'SET-ANS': setAnswer,
	'GAME-END': gameEnd,
//	'SET-TOKEN':getGameToken,
}				


module.exports = websocketServer;

