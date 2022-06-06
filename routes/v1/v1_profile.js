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

//errorhandler
var errorHandler = require('../lib/error');

router.post('/country',function(req,res,next) {
   var rtoken = req.body.token;

   if (rtoken) {
   		//verify token
   		jwtModule.jwtVerify(rtoken,function(callback){
			getJwt=JSON.parse(callback);
			if (getJwt.status=='success'){
				//country list
				dbQuery.getSelectAll(dbQuery.selectAll,["countries",""],function(callback){
					res.send(JSON.parse(callback));
				});
			} else {
				res.send(getJwt);
			}
                                                                                                

   		});
   		
    } else {
       return res.status(403).send(JSON.parse(errorHandler.tokenNone()));
  	}

 });


router.post('/province',function(req,res,next) {
   var rtoken = req.body.token;

   if (rtoken) {
   		//verify token
   		jwtModule.jwtVerify(rtoken,function(callback){
			getJwt=JSON.parse(callback);
			if (getJwt.status=='success'){
				//province list
				dbQuery.getSelectAll(dbQuery.selectAll,["province"],function(callback){
					res.send(JSON.parse(callback));
				});
			} else {
				res.send(getJwt);
			}
                                                                                                
   		});
   		
    } else {
       return res.status(403).send(JSON.parse(errorHandler.tokenNone()));
  	}

 });

router.post('/district',function(req,res,next) {
   var rtoken = req.body.token;
   var provinceId = req.body.province_id;	
   
   if (rtoken) {
		if (provinceId) {
   			//verify token
   			jwtModule.jwtVerify(rtoken,function(callback){
				getJwt=JSON.parse(callback);
				if (getJwt.status=='success'){
					//district list
					dbQuery.getSelectAll(dbQuery.whereProvince,["district",provinceId],function(callback){
						res.send(JSON.parse(callback));
					});
				} else {
					res.send(getJwt);
				}
   			});
   		} else {
	       return res.send(JSON.parse(errorHandler.paramNone()));
   		}
    } else {
       return res.status(403).send(JSON.parse(errorHandler.tokenNone()));
  	}

 }); 

router.post('/school',function(req,res,next) {
   var rtoken = req.body.token;
   var districtId = req.body.district_id;
   
   if (rtoken) {
   		if (districtId){
   			//verify token
   			jwtModule.jwtVerify(rtoken,function(callback){
				getJwt=JSON.parse(callback);
				if (getJwt.status=='success'){
					//school list for district
					dbQuery.getSelectAll(dbQuery.whereDistrict,["school",districtId],function(callback){
						res.send(JSON.parse(callback));
					});
				} else {
					res.send(getJwt);
				}
	   		});
   		} else {
	       return res.status(403).send(JSON.parse(errorHandler.paramNone()));
   		}
    } else {
       return res.status(403).send(JSON.parse(errorHandler.tokenNone()));
  	}

 });

module.exports = router
