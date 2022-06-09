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

//sms
const smsSend = require('../lib/smsSend');

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


module.exports=router
