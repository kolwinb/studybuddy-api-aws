var express = require('../../lib/node_modules/express');
//var config = require('../../config.js');

//18byt id generator
var uniqid = require ('../../lib/node_modules/uniqid');

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
