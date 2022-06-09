//this class verify jwt token and issue when request
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var fs = require("fs");

var cert = fs.readFileSync('private.pem');

//local log manager
var log = require("./log");
const status = require("./status");

const USR='techsas';
const PWD='Tech#123';
const MASK='Greentel';
const MSG='StudyBuddy OTP : ';

var smsSend = {
	smsApiKey : '40b5e4a44415a80818d65d4d1417df7e9b822e4db286ed5c';
	smsSecretKey : '63Srhl71FxVJuj90oJIHbXn7Ryf/sLiFivLw94SYQiC4qDR38dq4TcHTAW0GmJX5i32lLWdC/5+vgroqfda0936V';
	
	mobileVerification: function(mobile){
		smsRequest="https://bulksms.hutch.lk/sendsmsmultimask.php?USER=techsas&PWD=Tech%23123&MASK=Greentel&NUM=${mobile}&MSG=${MSG}";
		request.post(reqAccessToken, (err, resp, body) => {
			if (err) {
				console.log("sms not send");
				return JSON.parse(status.smsFailure());
			} else {
				log.info("SMS sent to "+mobile);
				return JSON.parse(status.stateSuccess("description":"SMS has been sent."));
				
			}
	}
}

module.exports = smsSend

