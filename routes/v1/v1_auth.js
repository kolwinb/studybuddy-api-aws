var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
//var config = require('../../config.js');

//send mails
var sendmail = require('/media/data/opt/nodejs/lib/node_modules/sendmail')({silent: true,devPort:25,devHost:'localhost'});

//18byt id generator
var uniqid = require ('/media/data/opt/nodejs/lib/node_modules/uniqid');


//mysql model
var pool = require('../../models/usermysql.js');

var app = express();
var router = express.Router();
var fs = require("fs");
var cert = fs.readFileSync('private.pem');
//mysql

//jwt custome module
var jwtToken=require('../lib/jwtToken');

function switchTable(req,res,tablename){
	console.log("table name : " + tablename);
    pool.getConnection(function(err,con){
    var signdate = new Date();
    console.log("authenticate time : " +signdate);
    if (err) {
//	    con.release();
	    console.log('connection pool error');
    throw err;
    res.json({success:false,message:'internal error'});
    } else {
    valrand=uniqid(); //uniq id
    console.log("email : "+req.body.email+" password : "+req.body.password);
    con.query("SELECT * FROM ?? WHERE email = ? and password = ?",[tablename,req.body.email,req.body.password], function (err,result,fields){
       if (!result[0]){
           res.json({success: false, message: 'Authentication failed. User not found.', errorcode:101});
       } else if (result[0].is_active == 1) {


		//(email,expSeconds,response)
		jwtToken.jwtAuth(result[0].email,3600,function(callback){
			res.send(JSON.parse(callback));
		
		}); 
   
      con.query ("UPDATE ?? SET last_sign=?  WHERE email=?",[tablename,signdate,req.body.email],function (err, result) {
	if (err) {
		console.log('authenticate timstamp database error');
      }
	else {
	console.log('last_sign timestamp updated');
	}       
});

       } else {
	 console.log('is not activated');
	 res.json({success:false,message:'Account is not activated. Please register again or activate your account'});
         con.query ("UPDATE ?? SET uniqid=?,last_sign=?  WHERE email=?",[tablename,valrand,signdate,req.body.email],function (err, result) {
             if (err) {
                 console.log('sql update error');
                 res.json({success:false,message:'Internal error'});
             }
             });
/*
         sendmail({  // send mail
                from: 'dharmavahini@gmail.com',
                to: req.body.email,
                subject: 'Account Activation',
                html: 'Hello <p>Thank you for registered with our online education service.</p><p>Please activate your account.</p><a href="http://api.learntv.lk/verify?id='+valrand+'">http://api.learntv.lk/verify?id='+valrand+'</a><p>Dharmavahini Team</p>' }, function (err,reply) {

                console.log(err && err.stack);
                console.dir(reply);
        });
*/

       }
con.release();
});
}
/*
con.on('error',function(err) {
   throw err;
   return;
});
*/
});
}
 
router.post('/',function(req,res){
	//get english part from url
	//learntv and english app are two seperate entity
    engparam=req.originalUrl;
	//console.log("english/ : "+engparam.match(/english/));
    if (engparam.match(/english/) == null){
		//console.log(engparam.match(/english/)[0]);
		console.log("request english/authenticate : null");
		tablename="user";
		switchTable(req,res,tablename);
	}
	else if (engparam.match(/english/)[0] == "english"){
		console.log("requested : " + engparam.match(/english/)[0] + "/authenticate");
		tablename="english_users";
		switchTable(req,res,tablename);
	}
    
});

//});

module.exports = router
