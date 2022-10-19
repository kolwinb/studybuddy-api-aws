var express = require('../../lib/node_modules/express');
var mclient = require('../../lib/node_modules/mongodb').MongoClient;
var jwt = require('../../lib/node_modules/jsonwebtoken');

//var url = "mongodb://192.168.1.110:27017/learntvapi";
var url = "mongodb://192.168.1.110:27017?poolSize=20";
var app = express();
var fs = require("fs");
var router = express.Router();

//using privatekey
var cert=fs.readFileSync('private.pem');

router.post('/',function(req,res,next) {
	var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
	if (rtoken) {
		jwt.verify(rtoken,cert,{aud:'urn:studes'},function(err,decoded){
 			if (err){
   				res.json({success:false,signature:"invalid"});
   				console.log(decoded);
			} else {
   				req.decoded = decoded;
   				mclient.connect(url,{ useUnifiedTopology: true },function(err,client) {
  					if(err){
  						console.log("can't connect mongodb");
  					} else { 
  						var db = client.db("learntvapi");
						//var collection = db.collection('channels');
   						db.collection("channels").find().toArray(function(err, result) {
							if (err) throw findErr;
							console.log('mongodb has connected and data gathered, v2_playlist sent to client.');
							res.end(JSON.stringify(result)); 
							client.close()

						});
					}
				});
			} 	
		});
	} else {
   		return res.status(403).send({ success: false,message:'No token provided.'});
  		}

});


module.exports = router
