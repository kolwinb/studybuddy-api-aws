var express = require('/media/data/opt/nodejs/lib/node_modules/express');
//var mclient = require('/media/data/opt/nodejs/lib/node_modules/mongodb').MongoClient;
//var Server = require('/media/data/opt/nodejs/lib/node_modules/mongodb').Server;
//var bodyParser = require('/media/data/opt/nodejs/lib/node_modules/body-parser');
//var morgan = require('/media/data/opt/nodejs/lib/node_modules/morgan');
//var mongoose = require('/media/data/opt/nodejs/lib/node_modules/mongoose');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
//var config = require('../../config.js');

//mongomodel
//var userinfo = require('./app/models/user.js');

//mysql model
//var pool = require('../../models/usermysql.js');

//var mysql = require('/media/data/opt/nodejs/lib/node_modules/mysql');
//var con = mysql.createConnection({ host:"192.168.1.120", user:"cb", password:"ltv9201712",database: "learntv_schema"});
var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var fs = require("fs");
var router = express.Router();
//app.use('/api',api);

//var port = process.env.PORT || 8082;
//mongoose.connect(config.database);
//app.set('sec',config.secret);

// get url parameters
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

// morgan used to log requests on console
//app.use(morgan('dev'));
//app.use(bodyParser());

//using privatekey
var cert=fs.readFileSync('private.pem');

router.post('/',function(req,res,next) {

   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {
jwt.verify(rtoken,cert,{aud:'urn:studes'},function(err,decoded)
{
     if (err){
       res.json({success:false,signature:'invalid',errorcode:104});
       console.log(decoded);
     }else {
	
       req.decoded = decoded;
       res.json({success:true,signature:'valid'});
    }
    });
    } else {
       return res.status(403).send({ success: false,message:'No token provided.',errorcode:105});
  }

 });

module.exports = router
