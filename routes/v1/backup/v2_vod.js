var express = require('../../lib/node_modules/express');
var mclient = require('../../lib/node_modules/mongodb').MongoClient;
var jwt = require('../../lib/node_modules/jsonwebtoken');

var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var fs = require("fs");
var router = express.Router();

var cert=fs.readFileSync('private.pem');

//get list of all channels
router.get('/',function(req,res) {
var client_id=req.headers['client-id'];
var client_secret=req.headers['client-secret'];

	if (client_id == '3233f31662e8caa469f778dbe5b92c' && client_secret == '2ImSjVfcMHkNfxWs5E5K5AynRG3AmY2MOayBCwZ5hecDuHOqt/BXqmajXF92Z1D+NpOeMEk/3hw3DhhbQzwoA+KhEr+qwIlPs+4RyyDg2c0='){
		console.log("client id and secret allowed");
		var contents = fs.readFileSync("/home/learntv-api/json-v2/channels.json");
		res.send(JSON.parse(contents));
		              
	} else {
		console.log("client id and secret not allowed");
		data = {
			"status":"error",
			"error": {
				"code":"105",
				"description":"Header mismatch"
				}
		}
		res.json(data);
	}


 });

//get list of all syllabus from particular channel
router.get('/:channel',function(req,res,next) {
var client_id=req.headers['client-id'];
var client_secret=req.headers['client-secret'];

	if (client_id == '3233f31662e8caa469f778dbe5b92c' && client_secret == '2ImSjVfcMHkNfxWs5E5K5AynRG3AmY2MOayBCwZ5hecDuHOqt/BXqmajXF92Z1D+NpOeMEk/3hw3DhhbQzwoA+KhEr+qwIlPs+4RyyDg2c0='){
		console.log("client id and secret allowed");
		var channel = req.params.channel
		var contents = fs.readFileSync("/home/learntv-api/json-v2/"+channel+".json");
		res.send(JSON.parse(contents));		              
	} else {
		console.log("client id and secret not allowed");
		data = {
			"status":"error",
			"error": {
				"code":"105",
				"description":"Header mismatch"
				}
		}
		res.json(data);
	}

 });

//get list of subjects
router.get('/:channel/:syllabus',function(req,res,next) {
var client_id=req.headers['client-id'];
var client_secret=req.headers['client-secret'];

	if (client_id == '3233f31662e8caa469f778dbe5b92c' && client_secret == '2ImSjVfcMHkNfxWs5E5K5AynRG3AmY2MOayBCwZ5hecDuHOqt/BXqmajXF92Z1D+NpOeMEk/3hw3DhhbQzwoA+KhEr+qwIlPs+4RyyDg2c0='){
		console.log("client id and secret allowed");
		var channel = req.params.channel;
		var syllabus = req.params.syllabus;
		var quality = req.params.quality;
		var contents = fs.readFileSync("/home/learntv-api/json-v2/"+channel+"_"+syllabus+".json");
		res.send(JSON.parse(contents));
	} else {
		console.log("client id and secret not allowed");
		data = {
			"status":"error",
			"error": {
				"code":"105",
				"description":"Header mismatch"
				}
		}
		res.json(data);
	}

 });
 
 
//get list of files with quality
//router.get('/:channel/:syllabus/:subject/:quality',function(req,res,next) {
router.get('/:channel/:syllabus/:subject',function(req,res,next) {


var client_id=req.headers['client-id'];
var client_secret=req.headers['client-secret'];

	if (client_id == '3233f31662e8caa469f778dbe5b92c' && client_secret == '2ImSjVfcMHkNfxWs5E5K5AynRG3AmY2MOayBCwZ5hecDuHOqt/BXqmajXF92Z1D+NpOeMEk/3hw3DhhbQzwoA+KhEr+qwIlPs+4RyyDg2c0='){
		console.log("client id and secret allowed");
 		var channel = req.params.channel;
   		var syllabus = req.params.syllabus;
   		var subject = req.params.subject;
   		var quality = req.params.quality;
   		var contents = fs.readFileSync("/home/learntv-api/json-v2/"+channel+"_"+syllabus+"_"+subject+".json");
   		res.send(JSON.parse(contents));
  	} else {
		console.log("client id and secret not allowed");
		data = {
			"status":"error",
			"error": {
				"code":"105",
				"description":"Header mismatch"
				}
		}
		res.json(data);
	}
 });



module.exports = router
