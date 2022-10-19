var express = require('../../lib/node_modules/express');
var jwt = require('../../lib/node_modules/jsonwebtoken');

//mysql model
var pool = require('../../models/usermysql.js');

var app = express();
var router = express.Router();

//load custom crypto module
var crypto = require("../lib/crypto");
const varErr = require("../lib/status");

router.post('/',function(req,res){

	if (!req.is('application/json')) {
		res.json(varErr.content);
    	console.log("content-type is not a application/json type");		
	} else {


		crypto.decryptAesRsa(req.body.data,function(callback)	{
	
			var varObj = JSON.parse(callback)
			subscriber_id=varObj.subscriber_id
			device_id=varObj.device_id
			var_vodId=varObj.vod_id
	//		email=varObj.email
		
    		pool.getConnection(function(err,con){
				if (err) {
					res.json(varErr.server);
					console.log("INFO:v2_Token.js:can't connect database server");
				} else {
				
					con.query("SELECT ? FROM ??  WHERE subscriber_id = ? and device_id = ?",["id","subscriber",subscriber_id,device_id], function(err,result){
						if (!result.length){
							res.json(varErr.subActivate);
						}else {
							console.log("subscription found. token is being generated");
					     	var_token = jwt.sign({
								iss:"learntv",
								aud:"students",
								exp: Math.floor(Date.now()/1000)+(60*60),
								subscriber_id:subscriber_id,
								device_id:device_id,
								vod_id:var_vodId
								},null,{algorithm:'none'});
							
							con.query("INSERT INTO ?? (id,token,vod_id) VALUES (?,?,?)",["token",0,var_token,var_vodId],function(err,result){
								if (err) {
									console.log(err);
									res.json(varErr.server);
								} else {
									//encrypt response data
        							enc_data=JSON.stringify({
        								"subscriber_id":subscriber_id,
        								"device_id":device_id,
        								"vod_id":var_vodId,
        								"token":var_token
        								});
        								
        							crypto.encryptAes(enc_data,function(callback){
										data = {
											"status":"success",
											"data" : callback 
										}
													
										res.json(data);
									});
								}
							}); //insert query
									
							//save token in database
					
						}
				
					}); //sql subscriber id query
				} //database connection error handling
			});//crypto custom module
		});//mysql pool database connection
	
		

	} //content type
});

module.exports = router


