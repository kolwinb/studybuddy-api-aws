var request = require('/media/data/opt/nodejs/lib/node_modules/request');

var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var router = express.Router();
const fs = require('fs');
const readline = require('readline');
const {google} = require('/media/data/opt/nodejs/lib/node_modules/googleapis');

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
//			var googleAuthCallback=request.get("
			fs.readFile('/home/data/opt/nodejs/studybuddy/routes/oauth/google-credentials.json', (err, content) => {
				if (err) return console.log('Error loading client secret file:', err);
				credentials=JSON.parse(content);
			
				const {client_secret, client_id, redirect_uris} = credentials.web;
				reqUri="https://oauth2.googleapis.com/token?code="+code+"&client_id="+client_id+"&client_secret="+client_secret+"&redirect_uri="+redirect_uris+"&grant_type=authorization_code&code_verifier="
				console.log(reqUri);
				request.post(reqUri, (err, resp, body) => {
					if (err) {
						console.log("access token error");
					} else {
						
						return res.json({token:body});
					}
//				return res.json({success:true,signature:"valid",client_id:client_id});
				});
			});
 		}
	});
	
	router.get('/authorize',function(req,res,next){

			setOauth2Client(function(err, oAuth2Client){
				if (err) return console.log('authorize : oAuth2Client error');
				const url = oAuth2Client.generateAuthUrl({
    				access_type: 'offline',
       				scope: SCOPES,
       				token_id:"test mmmm",
       				prompt: 'consent'
       				});	
  				return res.json({success:true,url:url});

			});
	
	});

module.exports = router

