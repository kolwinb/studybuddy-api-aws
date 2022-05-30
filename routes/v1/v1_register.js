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

function switchTable(req,res,tablename){
	console.log("table name : " + tablename);
    pool.getConnection(function(err,con){
    if (err) {
        con.release();
	console.log("v1_register: Mysql Error");
//        throw err; //prone to server crash
    } else if (!validator.validate(req.body.email)) { //email validation
        console.log("Email is not valid one");
        res.json({success: false,message:"Invalid email address",errorcode:102});
    } else {
	valrand=uniqid(); //uniq id
    console.log("email : "+req.body.email+" password :"+req.body.password+" username : "+req.body.username+" contact"+req.body.contact);
    con.query("SELECT email FROM ?? WHERE email= ?",[tablename,req.body.email], function (err,result,fields){
       if (!result.length){
           console.log("User not found"); 
           var signdate = new Date();
           console.log(signdate);
           con.query("INSERT INTO  ??(email,password,username,phone,date_joined,last_login,uniqid,is_active) VALUES (?,?,?,?,?,?,?,?)",[tablename,req.body.email,req.body.password,req.body.username,req.body.contact,signdate,signdate,valrand,1],function (err, result)
          		{
         			if (err) {
         				console.log('sql insert not working');
                   // this lines proven to can't set header error
					    res.json({success:false,message:'Internal error',errocode:100});
					    throw err;
//						res.end(); //can't set header error prevent
					} else {
			        	console.log(valrand + " : user has registered");
			      		res.json({success: true,message:'User has registered, Activation code has sent to '+req.body.email+'Email doesnt have your inbox, please check email spam folder'});
						res.end();
					}			
          });	    
            
    		sendmail({  // send mail
		from: 'dharmavahini@gmail.com',
		to: req.body.email,
		subject: 'Account Activation',
		html: 'Hello <p>Thank you for registered with our online education service.</p><p>Please activate your account.</p><a href="http://api.learntv.lk/verify?id='+valrand+'">http://api.learntv.lk/verify?id='+valrand+'</a><p>Dharmavahini Team</p>' }, function (err,reply) {
 		console.log(err && err.stack);
		console.dir(reply);
 	});	

       } else if (result[0].is_active==0) {
       		console.log('account not activated');
       		res.json({success:false,message:'Account not activated, Activation key has send',errorcode:103});
       } else if (result[0].is_active==1) {
           res.json({success:true,message:'Account has activated'}); 
       }  else {

/* 
                con.query ("UPDATE ?? SET uniqid=? WHERE email=?",[tablename,valrand,req.body.email],function (err, result) {
			if (err) {
				console.log('sql update error');
			        res.json({success:false,message:'Internal error',errorcode:100});
//				res.end(); // can't set header error prevent
		}
		});
*/
                res.json({success:false,message:"User already registered"});
 	}

  
    con.release()
    });
}
});
/*
con.on('error',function(err) {
    console.log("[mysql error]",err);
*/

}

//mysql db
router.post('/',function(req,res){
//	engparam=req.originalUrl;
//	if (engparam.match(/english/) == null){
		console.log("request register");
		tablename="user";
		switchTable(req,res,tablename);
//		}
//	else if (engparam.match(/english/)[0] == "english"){
//		console.log("requested english/register : true");
//		tablename="english_users";
//		switchTable(req,res,tablename);
//	}

});

module.exports = router;
