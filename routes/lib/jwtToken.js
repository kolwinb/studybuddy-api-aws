//this class verify jwt token and issue when request
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var fs = require("fs");

var cert = fs.readFileSync('private.pem');

//local log manager
var log = require("./log");
const state = require("./status");
var jwtToken = {
	jwtAuth: function(authOption,expSeconds,callback){
		var authDate = new Date();
		var newToken = jwt.sign({
								iss:"learntv",
								aud:"students",
								authTime:authDate.getTime(),
								exp: Math.floor(Date.now()/1000)+(expSeconds*1),
								authMethod:this.authOption},cert);
		content=JSON.stringify({"token":newToken});
		callback(state.stateSuccess(content));
		       	
	},

	jwtVerify: function(token,callback){
		jwt.verify(token,cert,{aud:'urn:studes'},function(err,decoded)
			{
 			if (err){
 				log.error("Token Expired");
 				callback(false);
//				callback(JSON.stringify({"status":"error","error":{"statusCode":"1004","description":"Token expired"}}));
//				res.json({success:false,signature:'invalid',errorcode:104});
			}else {
				log.info("Token Verified");
				callback(true);
//  				callback(JSON.stringify({status:"success",description:"Token verified"}));
//  				res.json({success:true,signature:'valid'});
  				
  			}

  			});	
	}


}


module.exports = jwtToken


/*
module.exports = function(){
//function (jtoken,email){
//	this.jtoken = jtoken;
//	this.email = email;
	this.jwtAuthSign = function (email){
		var token = jwt.sign({
			iss:"learntv",
			aud:"students",
			exp: Math.floor(Date.now()/1000)+(60*60),
			email:this.email},cert);
		return token;
	}
	
	this.jwtVerify = function (jtoken){
//		console.log("jtoken : "+jtoken);
		jwt.verify(jtoken,cert,{aud:'urn:studes'},function(err,decoded)
			{
 			if (err){
 				log.error("Token Expired");
//   				console.log("Token Expired");
//   				callback("error");
				return result="test";
//				return test = "{success:false,signature:'invalid',errorcode:104}";
			}else {
				log.info("Token Issued");
   				req.decoded = decoded;
				console.log("signature valid");
  				return {success:true,signature:'valid'};
  				
  			}
  		});
		
	
	}

}

*/
