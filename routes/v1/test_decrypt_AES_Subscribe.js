var express = require('/media/data/opt/nodejs/lib/node_modules/express');
//var config = require('../../config.js');

//send mails
var sendmail = require('/media/data/opt/nodejs/lib/node_modules/sendmail')({silent: true,devPort:25,devHost:'localhost'});

//email validator
var validator = require('/media/data/opt/nodejs/lib/node_modules/email-validator');

//18byt id generator
var uniqid = require ('/media/data/opt/nodejs/lib/node_modules/uniqid');

//mysql model
var pool = require('../../models/usermysql.js');


var app = express();
var router = express.Router();

//custom crypto modul
var crypto=require("../lib/crypto");

router.post('/',function(req,res){
	engparam=req.originalUrl;
	console.log("test_decrypt_AES_Subscribe : request data : "+req.body.data);
    
    crypto.decryptAes(req.body.data,function(callback){
		res.json(JSON.parse(callback));
	});
});


module.exports = router
