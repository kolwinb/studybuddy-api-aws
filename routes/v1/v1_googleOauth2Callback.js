const request = require('/media/data/opt/nodejs/lib/node_modules/request');
const express = require('/media/data/opt/nodejs/lib/node_modules/express');
const sessions = require('/media/data/opt/nodejs/lib/node_modules/express-session');

const app = express();
const router = express.Router();
const fs = require('fs');
const readline = require('readline');
const {google} = require('/media/data/opt/nodejs/lib/node_modules/googleapis');
const {OAuth2Client} = require('/media/data/opt/nodejs/lib/node_modules/google-auth-library');

//initialize session usage
app.use(sessions({
	secret: "mQ1U9vVGyHULdgZWeQ3HFNXS6uRt7PqU09Vc4IxfrMsmHfxFlt77hu6BAUDazVgZHTvxQQwAer23JneGwWt4ctzAqFK7Snjv3xY4DuWmyULd+6D2WEvPmwAm6V6V6Y6AFfTHaYTqYkERsMmup3N+C/Nti9rk8jd2aJgf7doHi9M=",
	saveUninitialized: true,
	resave: true,
}));
//app.use(router);

const jwtToken = require('../lib/jwtToken');
const log = require('../lib/log');
const status = require('../lib/status');
const dbQuery = require('../lib/dbQuery');

const SCOPES = [
//				'https://www.googleapis.com/auth/contacts.readonly',
				'https://www.googleapis.com/auth/userinfo.profile',
//				'https://www.googleapis.com/auth/user.emails.read',
//				'https://www.googleapis.com/auth/user.birthday.read',
//				'https://www.googleapis.com/auth/user.addresses.read',
//				'https://www.googleapis.com/auth/user.gender.read',
//				'https://www.googleapis.com/auth/user.phonenumbers.read',
				'https://www.googleapis.com/auth/userinfo.email',
				];
const TOKEN_PATH = '/home/data/opt/nodejs/studybuddy/routes/oauth/token.json';

/*
	function getNewToken(oAuth2Client, callback) {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});
		console.log('Authorize this app by visiting this url:', authUrl);
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question('Enter the code from that page here: ', (code) => {
			rl.close();
			oAuth2Client.getToken(code, (err, token) => {
  				if (err) return console.error('Error retrieving access token', err);
				oAuth2Client.setCredentials(token);
				// Store the token to disk for later program executions
				fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
					if (err) return console.error(err);
					console.log('Token stored to', TOKEN_PATH);
				});
				callback(oAuth2Client);
			});
		});
  	}
  
	function listConnectionNames(auth) {
		const service = google.people({version: 'v1', auth});
		service.people.connections.list({
			resourceName: 'people/me',
			pageSize: 10,
			personFields: 'names,emailAddresses',
		}, (err, res) => {
			if (err) return console.error('The API returned an error: ' + err);
			const connections = res.data.connections;
			if (connections) {
				console.log('Connections:');
				connections.forEach((person) => {
					if (person.names && person.names.length > 0) {
						console.log('connection success');
					} else {
						console.log('No display name found for connection.');
					}
				});
  			} else {
				console.log('No connections found.');
			}
  		});
  	}

*/
	//can make callback as follow
	//setOauthClient = function(callback){callback()}
	//function setOauthClient(callback){callback()}

	function setOauth2Client(callback){
		// Load client secrets from a local file.
		fs.readFile('/home/data/opt/nodejs/studybuddy/routes/oauth/google-credentials.json', (err, content) => {
			if (err) return console.log('Error loading client secret file:', err);
			credentials=JSON.parse(content);
				
			const {client_secret, client_id, redirect_uris} = credentials.web;
			
			const oAuth2Client = new google.auth.OAuth2(
				client_id, 
				client_secret, 
				redirect_uris[0]
				);
		callback(null, oAuth2Client); //null means error
		});
	}

	router.get('/callback',function(req,res,next) {
 		code=req.query.code;
		stateToken=req.query.state;
 //		log.info("steteToken :"+stateToken);
 //		log.info(req.query);

 		if (code == null){
 			console.log("empty google api code");
 			return res.json({success:false,signature:"invalid",errorcode:106});
 		} else {
			console.log("code : " + code);
			/*
			setOauth2Client(function(err, oAuth2Client){
				if(err) console.log("can't connect google server");
			oAuth2Client.getToken(code, (err, token) => {
  				if (err) return console.error('Error retrieving access token', err);
				// Store the token to disk for later program executions
					fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
						if (err) return console.error(err);
						console.log('Token stored to', TOKEN_PATH);
					});
				oAuth2Client.setCredentials(token);
//				console.log("Client_id : "+oAuth2Client.client_id);

				});
			});
			            
			*/
			var signdate = new Date();
			fs.readFile('/home/data/opt/nodejs/studybuddy/routes/oauth/google-credentials.json', (err, content) => {
				if (err) return console.log('Error loading client secret file:', err);
				credentials=JSON.parse(content);
			
				const {client_secret, client_id, redirect_uris} = credentials.web;
				reqAccessToken="https://oauth2.googleapis.com/token?code="+code+"&client_id="+client_id+"&client_secret="+client_secret+"&redirect_uri="+redirect_uris+"&grant_type=authorization_code&code_verifier="
				//reqRefreshToken="https://oauth2.googleapis.com/token?client_id="+client_id+"&client_secret="+client_secret+"&redirect_uri="+redirect_uris+"&grant_type=refresh_token&refresh_token="
				console.log(reqAccessToken);
				request.post(reqAccessToken, (err, resp, body) => {
					if (err) {
						console.log("access token error");
						res.status(200).send('');
					} else {
							token=JSON.parse(body);
							refreshToken=token.refresh_token;
							accessToken=token.access_token;
							id_token=token.id_token;
							log.info('client_id : '+ client_id);
							log.info('id_token : '+id_token);
						/*
						if (accessToken) {
							request({
										url:'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses',
//										url:'https://people.googleapis.com/v1/people/me?personFields=emailAddresses',
										json: true,
										method: 'GET',
										headers: {
												'Authorization': 'Bearer '+accessToken,
												'Content-Type': 'application/json',
												'Accept':'application/json',
												}
										}, (err, respo, body) => {
											resBody=JSON.parse(JSON.stringify(body));
											var dateTime = new Date();
											
											content={
											//	gender:resBody.genders[0].value,
											//	birthday:resBody.birthdays[0].date.year+"-"+resBody.birthdays[0].date.month+"-"+resBody.birthdays[0].date.day,
												name:resBody.names[0].displayName,
												familyName:resBody.names[0].familyName,
												givenName:resBody.names[0].givenName,
												email:resBody.emailAddresses[0].value
											}

											dbQuery.setUserSqlQuery(dbQuery.whereEmail,["user",content],function(callback){
												if (callback[0]){
													log.info("whereEmail id : "+content+" : id "+callback[0].id);
													//finduserId=callback[0].id;
													dbQuery.setSqlUpdate(dbQuery.updateOauth,["oauth2_token",stateToken,dateTime,callback[0].id],function(callbackA){
														if(callbackA){
															log.info("google new oauth token updated");
															//respone herpe
															//res.sendStatus(200);
														} else {
															log.error("oauth2_token update server error.")
															//res.sendStatus(200);
														}
															
													});
												} else {
													dbQuery.setUserInsert(dbQuery.insertUser,["user",content,'NULL',content.givenName,'NULL',dateTime,dateTime,'NULL',1,'NULL'],function(callbackB){
														if (callbackB) {
															dbQuery.setUserSqlQuery(dbQuery.whereEmail,["user",content],function(callbackC){
																if (callbackC[0]){
																	//userId=callbackC[0].id;
															 		log.info("stateToken :"+stateToken);
															 		log.info("userid : "+callbackC[0].id);
																	//jwtToken.jwtAuth(email,3600,function(callback){
																	dbQuery.setUserInsert(dbQuery.insertOauth,["oauth2_token","NULL",stateToken,dateTime,dateTime,callbackC[0].id],function(callbackD){
																		if(callbackD){
																			
																			log.info("New google oauth Token stored");
																			res.sendStatus(200);
																			
																			//response
																		} else {
																		
																			log.error("oauth2_token insert server error");
																			res.sendStatus(200);
																		}
																			
																	});
																	//	res.send(JSON.parse(callback));
																	//});		
																}
															});
														}	
													});
													
												}
											});
						
											//return res.json(content);
										
										});

//							return res.json({access_token:token.access_token});

							
						} else {
							console.log("access token is empty");
							return res.status(200).send('');
						}
						*/
					}
					
					//get info for debug
					tokenSign={
						client_id:client_id,
						id_token:id_token													
					};	
					res.json(JSON.parse(JSON.stringify(tokenSign)));

//				return res.json({success:true,signature:"valid",client_id:client_id});
				});
			});

 		}
	});
	
	router.get('/authorize',function(req,res){
		//create session epoch
//		req.session.epoch==MeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsZWFybnR2IiwiYXVkIjoic3R1ZGVudHMiLCJhdXRoVGltZSI6MTY1NjE2NTczNjg4NywiZXhwIjoxNjU2MTY5MzM2LCJhdXRoTWV0aG9kIjoiYmFuZGFyYUBkaGFybWF2YWhpbmkudHYiLCJpYXQiOjE2NTYxNjU3MzZ9.Fn-ylpIaaZrLWXGCGnrzVBqWil4lcaB6RoHomwQNRkoath.floor(new Date().getTime());
//		req.session.epoch=='test';
//		sess=req.session;
		//get time epoch 
//		session.txt=='test';
//		console.log("req session : "+sess.epoch);
		
//		return res.json({"session":Date()});
			setOauth2Client(function(err, oAuth2Client){
				if (err) return console.log('authorize : oAuth2Client error');
				var timeStamp=new Date().getTime();
				var token=''
				jwtToken.jwtAuth(timeStamp,3600,function(callback){
					var tokenCall=JSON.parse(callback);
					log.info("state token : "+tokenCall.data.token);
					token=tokenCall.data.token;
	 				const url = oAuth2Client.generateAuthUrl({
    					access_type: 'offline',
       					scope: SCOPES,
       					state:token,
       					prompt: 'consent'
       					});	
       				if (url) {
	  					res.json({status:"success",url:url});
					} else {
						res.send(status.thirdPartyAuth());
					}
				});

			});

	
	});

	router.get('/token',function(req,res){
	
	
	});

	router.post('/accesstoken',function(req,res){
		var accessToken=req.body.accessToken;
		log.info("Access Token :"+accessToken);
		dbQuery.setUserSqlQuery(dbQuery.whereAccessToken,["oauth2_token",accessToken],function(callback){
			if (callback[0]){
				jwtToken.jwtVerify(accessToken,function(callbackA){
					if (callbackA){
						log.info("access token verificatioin done");
						content=JSON.stringify({"description":"Token verified"});
						res.send(JSON.parse(status.stateSuccess(content)));
					} else {
						log.error("access token expired");
						res.send(JSON.parse(status.googleAccessToken()));
					}	
				});		
			} else {
				res.send(JSON.parse(status.googleNotAuth()));
			}
		
		});
	
	});

	async function verify(CLIENT_ID,token,res) {
		const client = new OAuth2Client(CLIENT_ID);

  		const ticket = await client.verifyIdToken({
			idToken: token,
  			audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
			// Or, if multiple clients access the backend:
  			//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
		});
  		const payload = ticket.getPayload();
		const userid = payload['sub'];
  		// If request specified a G Suite domain:
		// const domain = payload['hd'];
//			log.info(JSON.stringify(payload,null,2));
	
		resBody=JSON.parse(JSON.stringify(payload));
		var dateTime = new Date();
		
		content={
			userId:resBody.email
		}
		
		dbQuery.setUserSqlQuery(dbQuery.whereEmail,["user",resBody.email],function(callback){
			if (callback[0]){
				log.info("google login : "+content+" : id "+callback[0].id);
				//finduserId=callback[0].id;
				dbQuery.setSqlUpdate(dbQuery.updateLastLogin,["user",dateTime,callback[0].id],function(callbackAA){
					if (callbackAA) {
						log.info("google new oauth token updated");
						userContent={
							userId:callback[0].id
							}
						jwtToken.jwtAuth(userContent,3600,function(callbackJwt){
							res.send(JSON.parse(callbackJwt));
						});
					} else {
						res.send(JSON.parse(status.server()));
					}
				});
	
			} else {
				log.info("google New login : "+content);
				dbQuery.setUserInsert(dbQuery.insertUser,["user",resBody.email,'NULL',content.givenName,'NULL',dateTime,dateTime,'NULL',1,'NULL'],function(callbackB){
					if (callbackB) {
						dbQuery.setUserSqlQuery(dbQuery.whereEmail,["user",resBody.email],function(callbackC){
							if (callbackC[0]){
								userContent={
									userId:callbackC[0].id
								}
								log.info("userid : "+callbackC[0].id);
								log.info("New google oauth Token stored");
								jwtToken.jwtAuth(userContent,3600,function(callbackJwt){
									res.send(JSON.parse(callbackJwt));
								});
							}
						});
					} else {
						res.send(JSON.parse(status.server()));
						
					}	
				
				});
				
			}
		});
	}

	router.post('/tokensignin',function(req,res){
		const CLIENT_ID=req.body.client_id;
		const token = req.body.id_token;
		verify(CLIENT_ID,token,res).catch(error => {
			log.error("google Id-Toekn catch error detected");
			res.send(JSON.parse(status.googleTokenTimeout()));
		});
	});
	
app.use('/',router);
module.exports = app


