//this class verify jwt token and issue when request
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var fs = require("fs");

var cert = fs.readFileSync('private.pem');

//local log manager
var log = require("./log");
const state = require("./status");
var jwtToken = {
	jwtGetUserId: function(token,callback){
		const jwtPayload=jwt.decode(token);
		//console.log(jwtPayload.authMethod);
		callback(jwtPayload.authMethod);	
	
	},

	jwtAuth: function(authOption,expSeconds,callback){
		var authDate = new Date();
		var newToken = jwt.sign({
								iss:"learntv",
								aud:"students",
								authTime:authDate.getTime(),
								exp: Math.floor(Date.now()/1000)+(expSeconds*1), //uniq time in seconds
								authMethod:authOption},cert);
		content=JSON.stringify({"token":newToken});
		callback(state.stateSuccess(content));
		       	
	},

	jwtVerify: function(token,callback){
//		jwt.verify(token,cert,{aud:'urn:studes'},function(err,decoded)
		jwt.verify(token,cert,function(err,decoded)
			{
 			if (err){
 				log.error("jwt Token Expired");
 				callback(false);
			}else {
				log.info("jwt Token Verified");
				callback(true);
  				
  			}

  			});	
	}


}


module.exports = jwtToken


