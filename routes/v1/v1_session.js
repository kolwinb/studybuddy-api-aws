var express = require('../../lib/node_modules/express');
var jwt = require('../../lib/node_modules/jsonwebtoken');

var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var fs = require("fs");
var router = express.Router();

//using privatekey
var cert=fs.readFileSync('private.pem');


//custom jwt module
var jwtModule = require('../lib/jwtToken');
const status = require('../lib/status');
const log = require('../lib/log');
const dbQuery = require('../lib/dbQuery');
router.post('/',function(req,res,next) {

   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {

		jwtModule.jwtVerify(rtoken,function(callback){
			if (callback) {
				contents=JSON.stringify({"description":"Token verified"});
				jwtModule.jwtGetUserId(rtoken,function(callbackUser){
					const userId=callbackUser.userId
					dbQuery.getSelect(dbQuery.whereOnlineStatus,[userId],function (callbackOnline){
						if (!callbackOnline[0]) {
							res.send(JSON.parse(status.server()));
						} else if (callbackOnline[0].status == 'online'){
							res.send(JSON.parse(status.notAllowLogin()));
						} else if (callbackOnline[0].status == 'offline'){
							res.send(JSON.parse(status.stateSuccess(contents)));
						}
					});

				});
			} else {
				res.send(JSON.parse(status.tokenExpired()));
			}
		});

    } else {
       res.send(JSON.parse(status.tokenNone()));
  }

 });

module.exports = router
