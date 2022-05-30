const request = require('/media/data/opt/nodejs/lib/node_modules/request');
const express = require('/media/data/opt/nodejs/lib/node_modules/express');
const sessions = require('/media/data/opt/nodejs/lib/node_modules/express-session');

const app = express();
const router = express.Router();
const fs = require('fs');
const readline = require('readline');
const {google} = require('/media/data/opt/nodejs/lib/node_modules/googleapis');

//initialize session usage
app.use(sessions({
	secret: "mQ1U9vVGyHULdgZWeQ3HFNXS6uRt7PqU09Vc4IxfrMsmHfxFlt77hu6BAUDazVgZHTvxQQwAer23JneGwWt4ctzAqFK7Snjv3xY4DuWmyULd+6D2WEvPmwAm6V6V6Y6AFfTHaYTqYkERsMmup3N+C/Nti9rk8jd2aJgf7doHi9M=",
	saveUninitialized: true,
	resave: true,
}));
//app.use(router);


const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly',
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/user.emails.read',
				'https://www.googleapis.com/auth/user.birthday.read',
				'https://www.googleapis.com/auth/user.addresses.read',
				'https://www.googleapis.com/auth/user.gender.read',
				'https://www.googleapis.com/auth/user.phonenumbers.read',
				'https://www.googleapis.com/auth/userinfo.email',
				'https://www.googleapis.com/auth/userinfo.profile'
				];
const TOKEN_PATH = '/home/data/opt/nodejs/studybuddy/routes/oauth/token.json';

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
						console.log(person.names[0].displayName);
					} else {
						console.log('No display name found for connection.');
					}
				});
  			} else {
				console.log('No connections found.');
			}
  		});
  	}


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
				console.log("ssss"+oAuth2Client.client_id);

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
						return res.status(200).send('');
					} else {
							token=JSON.parse(body);
							refreshToken=token.refresh_token;
							accessToken=token.access_token;
						if (accessToken) {
							request({
										url:'https://people.googleapis.com/v1/people/me?personFields=addresses,birthdays,emailAddresses,genders,phoneNumbers',
										json: true,
										method: 'GET',
										headers: {
												'Authorization': 'Bearer '+accessToken,
												'Content-Type': 'application/json',
												'Accept':'application/json',
												}
										}, (err, respo, body) => {
											resBody=JSON.parse(JSON.stringify(body));
//											gender=resBody.genders[0].value;
//											birthday=resBody.birthdays[0].date.year+"-"+resBody.birthdays.date.month+"-"+resBody.birthdays.date.day;
//											birthday=resBody.birthdays.date;
//											sourceEmail=resBody.emailAddresses[0].value;
											
											content={
												gender:resBody.genders[0].value,
												birthday:resBody.birthdays[0].date.year+"-"+resBody.birthdays[0].date.month+"-"+resBody.birthdays[0].date.day,
												email:resBody.emailAddresses[0].value
											}
											
											return res.json(content);
										
										});


//							return res.json({access_token:token.access_token});

							
						} else {
							console.log("access token is empty");
							return res.status(200).send('');
						}
					}
//				return res.json({success:true,signature:"valid",client_id:client_id});
				});
			});

 		}
	});
	
	router.get('/authorize',function(req,res){
		//create session epoch
//		req.session.epoch==Math.floor(new Date().getTime());
		req.session.epoch=='test';
		sess=req.session;
		//get time epoch 
//		session.txt=='test';
		console.log("req session : "+sess.epoch);
		
		return res.json({"session":Date()});
			setOauth2Client(function(err, oAuth2Client){
				if (err) return console.log('authorize : oAuth2Client error');
				const url = oAuth2Client.generateAuthUrl({
    				access_type: 'offline',
       				scope: SCOPES,
       				token_id:session.epoch,
       				prompt: 'consent'
       				});	
  				return res.json({success:true,url:url});

			});
	
	});

app.use('/',router);
module.exports = app

