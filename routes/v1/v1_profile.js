var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var app = express();
var fs = require("fs");
var router = express.Router();
//app.use('/api',api);

//using privatekey
var cert=fs.readFileSync('private.pem');

//jwtcustom class
var jwtModule = require('../lib/jwtToken');

//dbquery module
var dbQuery = require('../lib/dbQuery');

//status
var status = require('../lib/status');

router.post('/country',function(req,res,next) {
   var rtoken = req.body.token;

   if (rtoken) {
   		//verify token
   		jwtModule.jwtVerify(rtoken,function(callback){
			if (callback){
				//country list
				dbQuery.getSelectAll(dbQuery.selectAll,["countries",""],function(callback){
					res.send(JSON.parse(status.stateSuccess(callback)));
				});
			} else {
				res.send(JSON.parse(status.tokenExpired()));
			}
                                                                                                

   		});
   		
    } else {
       return res.status(403).send(JSON.parse(status.tokenNone()));
  	}

 });


router.post('/province',function(req,res,next) {
   var rtoken = req.body.token;

   if (rtoken) {
   		//verify token
   		jwtModule.jwtVerify(rtoken,function(callback){
			if (callback){
				//province list
				dbQuery.getSelectAll(dbQuery.selectAll,["province"],function(callback){
					res.send(JSON.parse(status.stateSuccess(callback)));
				});
			} else {
				res.send(JSON.parse(status.tokenExpired()));
			}
                                                                                                
   		});
   		
    } else {
       return res.status(403).send(JSON.parse(status.tokenNone()));
  	}

 });

router.post('/district',function(req,res,next) {
   var rtoken = req.body.token;
   var provinceId = req.body.province_id;	
   
   if (rtoken) {
		if (provinceId) {
   			//verify token
   			jwtModule.jwtVerify(rtoken,function(callback){
				if (callback){
					//district list
					dbQuery.getSelectAll(dbQuery.whereProvince,["district",provinceId],function(callback){
						res.send(JSON.parse(status.stateSuccess(callback)));
					});
				} else {
					res.send(JSON.parse(status.tokenExpired()));
				}
   			});
   		} else {
	       return res.send(JSON.parse(status.paramNone()));
   		}
    } else {
       return res.status(403).send(JSON.parse(status.tokenNone()));
  	}

 }); 

router.post('/school',function(req,res,next) {
   var rtoken = req.body.token;
   var districtId = req.body.district_id;
   
   if (rtoken) {
   		if (districtId){
   			//verify token
   			jwtModule.jwtVerify(rtoken,function(callback){
				if (callback){
					//school list for district
					dbQuery.getSelectAll(dbQuery.whereDistrict,["school",districtId],function(callback){
						res.send(JSON.parse(status.stateSuccess(callback)));
					});
				} else {
					res.send(JSON.parse(status.tokenExpired()));
				}
	   		});
   		} else {
	       return res.status(403).send(JSON.parse(status.paramNone()));
   		}
    } else {
       return res.status(403).send(JSON.parse(status.tokenNone()));
  	}

 });

module.exports = router
