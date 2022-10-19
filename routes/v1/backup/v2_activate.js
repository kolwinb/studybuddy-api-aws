var express = require('../../lib/node_modules/express');
//var config = require('../../config.js');

var fs = require('fs');

//mysql model
var pool = require('../../models/usermysql.js');

var app = express();
var router = express.Router();

//mysql db
router.get('/',function(req,res){
//    if (err) throw err;  
    console.log(req.query.id);
    pool.getConnection(function(err,con){
    if (err) {
        con.release();
        throw err;
    } else {
    con.query("SELECT uniqid FROM users WHERE uniqid= ?",[req.query.id], function (err,result,fields){
       if (!result.length){
           console.log("activation code not exist"); 
//           res.json({success: false,message:'Activation code invalid'});
	   res.sendFile(__dirname+'/template/deactivate.html');

       } else {
           con.query("UPDATE users SET is_active = 1 WHERE uniqid=?",[req.query.id],function (err, result)
          		{
         			if (err) {
					console.log('cant mysql update');
					res.json({success: false,message:'Internal Error'});
				} else {
            				console.log(result);
            				//res.json({success: true,message:'Account has activated'});
				   res.sendFile(__dirname+'/template/activate.html');
				}
       
    		});
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
