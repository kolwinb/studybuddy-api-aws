var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var mclient = require('/media/data/opt/nodejs/lib/node_modules/mongodb').MongoClient;
//var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var cors = require('/media/data/opt/nodejs/lib/node_modules/cors'); //cross-origin-resource-sharing


var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var router = express.Router();

router.use(cors());

router.get('/', function (req, res) {            
      res.header("Access-Control-Allow-Origin","http://dev.learntv.lk");
      mclient.connect(url,{ useUnifiedTopology: true },function(err,db) {
      if(err){
      console.log("can't connect mongodb");
      }else{
//      db.collection("channels").find({},{_id:1,subject:1,lesson:1,duration:1,start_time:1,description:1,image_url:1}).toArray(function(err, result) {
      db.collection("channels").find().toArray(function(err, result) {
         if(err)
         { console.log("can't find data on mongodb"); }
         else
         { 
         console.log('database connected',result);
         res.end(JSON.stringify(result)); 
         }
    });}
    db.close();
    });

});

module.exports = router
