var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var mclient = require('/media/data/opt/nodejs/lib/node_modules/mongodb').MongoClient;
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');

var url = "mongodb://192.168.1.110:27017/studybuddy";
var app = express();
var fs = require("fs");
var router = express.Router();

var cert=fs.readFileSync('private.pem');

//custom jwt module
var jwtModule = require('../lib/jwtToken.js');

//get list of all channels
router.post('/',function(req,res,next) {
   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {
		jwtModule.jwtVerify(rtoken,function(callback){
			getJwt=JSON.parse(callback);
			if (getJwt.status=='success'){
       			var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/grades.json");
       			res.send(JSON.parse(contents));						
			} else {
				res.send(getJwt);         
			}      
		}); 

    }else {
       return res.status(403).send({ success: false,message:'No token provided.'});
  }

 });

//get list of all subject from particular channel
router.post('/:grade',function(req,res,next) {
   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {
		jwtModule.jwtVerify(rtoken,function(callback){
			getJwt=JSON.parse(callback);
			if (getJwt.status=='success'){
		      	var grade = req.params.grade
		      	var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+".json");
		      	res.send(JSON.parse(contents));						
			} else {
				res.send(getJwt);         
			}      
		}); 

    }else {
       return res.status(403).send({ success: false,message:'No token provided.'});
  }

 });
 
 
 //get list of syllabus by year from particular channel
router.post('/:grade/:syllabus',function(req,res,next) {
   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {
		jwtModule.jwtVerify(rtoken,function(callback){
			getJwt=JSON.parse(callback);
			if (getJwt.status=='success'){
       			var grade = req.params.grade;
       			var syllabus = req.params.syllabus;
       			var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+"_"+syllabus+".json");
       			res.send(JSON.parse(contents));
			} else {
				res.send(getJwt);         
			}      
		}); 

    }else {
       return res.status(403).send({ success: false,message:'No token provided.'});
  }

 });

//get list of file by quality
router.post('/:grade/:subject/:quality',function(req,res,next) {
   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {
		jwtModule.jwtVerify(rtoken,function(callback){
			getJwt=JSON.parse(callback);
			if (getJwt.status=='success'){
       			var grade = req.params.grade;
       			var subject = req.params.subject;
       			var quality = req.params.quality;
       			var contents = fs.readFileSync("/home/data/opt/nodejs/studybuddy/json/"+grade+"_"+subject+"_"+quality+".json");
       			res.send(JSON.parse(contents));
			} else {
				res.send(getJwt);         
			}      
		}); 
		
    }else {
       return res.status(403).send({ success: false,message:'No token provided.',"errorcode":"105"});
  }

 });



module.exports = router
