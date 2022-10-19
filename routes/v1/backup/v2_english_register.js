var express = require('../../lib/node_modules/express');
//var config = require('../../config.js');

//send mails
var sendmail = require('../../lib/node_modules/sendmail')({silent: true,devPort:25,devHost:'localhost'});

//email validator
var validator = require('../../lib/node_modules/email-validator');

//18byt id generator
var uniqid = require ('../../lib/node_modules/uniqid');

//mysql model
var pool = require('../../models/usermysql.js');

var app = express();
var router = express.Router();

//mysql db
router.post('/',function(req,res){
//    if (err) throw err;  

    pool.getConnection(function(err,con){
    if (err) {
        con.release();
	console.log("v1.2_register: Mysql Error");
//        throw err; //prone to server crash
    } else if (!validator.validate(req.body.txtemail)) { //email validation
        console.log("Email is not valid one");
        res.json({success: false,message:"Invalid email address"});
    } else {
	valrand=uniqid(); //uniq id
    console.log(req.body.txtemail);
    con.query("SELECT email FROM users WHERE email= ?",[req.body.txtemail], function (err,result,fields){
       if (!result.length){
           console.log("User not found"); 
           var signdate = new Date();
           console.log(signdate);
           con.query("INSERT INTO users (email,date,uniqid,is_active) VALUES (?,?,?,?)",[req.body.txtemail,signdate,valrand,1],function (err, result)
          		{
         			if (err) {
                                    console.log('sql insert not working');
				    res.json({success:false,message:'Internal error'});
				    res.end(); //can't set header error prevent
	  }			
          });	      
        	console.log(valrand);
    		sendmail({  // send mail
		from: 'dharmavahini@gmail.com',
		to: req.body.txtemail,
		subject: 'Account Activation',
		html: 'Hello <p>Thank you for registered with our online education service.</p><p>Please activate your account.</p><a href="http://api.learntv.lk/verify?id='+valrand+'">http://api.learntv.lk/verify?id='+valrand+'</a><p>Dharmavahini Team</p>' }, function (err,reply) {
 		console.log(err && err.stack);
		console.dir(reply);
 	});	
      		res.json({success: true,message:'User has registered, Activation code has sent to '+req.body.txtemail+'Email doesnt have your inbox, please check email spam folder'});

       } else if (result[0].is_active==0) {
       		console.log('account not activated');
       		res.json({success:false,message:'Account not activated, Activation key has send'});
       } else if (result[0].is_active==1) {
           res.json({success:true,message:'Account has activated'}); 
       }  else {

/* 
                con.query ("UPDATE users SET uniqid=? WHERE email=?",[valrand,req.body.txtemail],function (err, result) {
			if (err) {
				console.log('sql update error');
			        res.json({success:false,message:'Internal error'});
				res.end(); // can't set header error prevent
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
});

module.exports = router
