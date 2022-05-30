var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');

//mysql model
var pool = require('../../models/usermysql.js');

var app = express();
var router = express.Router();

//load custom crypto module
var crypto = require("../lib/crypto");

router.post('/',function(req,res){

	if (!req.is('application/json')) {

		data = {
			"status":"error",
			"error":{
				"code":101,
				"description":"Content type mismatch"
			}
		}
		res.json(data);
    	console.log("content-type is not a application/json type");		
	} else {


/*
		var_data=req.body.data;
		//console.log(var_data);
		var data = var_data.split(":");
		varData=data[0];
		varKey=data[1];
		iv_length=16;
				
		const password = rsaDecrypt(varKey, 'crypto/rsa_4096_priv.pem');
		console.log('decrypt password', password);

        const key = Buffer.concat([Buffer.from(password)], Buffer.alloc(32).length);
        console.log("key :"+key);
        const iv = Buffer.from(key.slice(0,16));
        console.log("iv :"+iv);                                

		//mobile app tasks
		//AES-256 data encryption
		var enc_data = aes_256_encrypt('{"subscriber_id":"609349850355","device_id":"aaaa"}',password,key,iv)
		console.log("data aes_256 :"+enc_data);
		//password encryption
		const enc_passwd = rsaEncrypt(password, 'crypto/rsa_4096_pub.pem');
		console.log('password rsa_4096:', enc_passwd);
		//decrypt password
		//end mobile app tasks
		
		//decrypt password to get data 
		const dec_passwd = rsaDecrypt(enc_passwd, 'crypto/rsa_4096_priv.pem');
		console.log('decrypt password', dec_passwd);
		console.log("decrypt data",aes_256_decrypt(enc_data,password,key,iv));
		//End of Mobile Task//

		dec_data=aes_256_decrypt(varData,password,key,iv);
		console.log("decode data : "+dec_data);
	//	res.json(varObj.subscriber_id);

*/
		crypto.decryptAesRsa(req.body.data,function(callback)	{
	
			var varObj = JSON.parse(callback)
			subscriber_id=varObj.subscriber_id
			device_id=varObj.device_id
			var_vodId=varObj.vod_id
	//		email=varObj.email
		
    		pool.getConnection(function(err,con){
				if (err) {
					data = {
						"status":"error",
						"error":{
							"code":100,
							"description":"Internal Server Error"
							}
						}
					res.json(data);
					console.log("INFO:v2_Token.js:can't connect database server");
				} else {
				
					con.query("SELECT ? FROM ??  WHERE subscriber_id = ? and device_id = ?",["id","subscriber",subscriber_id,device_id], function(err,result){
						if (!result.length){
							data = {
								"status":"error",
								"error": {
								"code":"104",
								"description" : "subscription has not been activated"
								}
							}
							res.json(data);
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
							
							con.query("INSERT INTO ?? (id,token,vod_id) VALUES (?,?,?)",["token","NULL",var_token,var_vodId],function(err,result){
								if (err) {
									data = {
										"status":"error",
										"error":{
											"code":100,
											"description" : "Internal Server Error"
											}
									}
									console.log(err);
									res.json(data);
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


