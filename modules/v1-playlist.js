var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var mclient = require('/media/data/opt/nodejs/lib/node_modules/mongodb').MongoClient;
//var Server = require('/media/data/opt/nodejs/lib/node_modules/mongodb').Server;
//var bodyParser = require('/media/data/opt/nodejs/lib/node_modules/body-parser');
//var morgan = require('/media/data/opt/nodejs/lib/node_modules/morgan');
//var mongoose = require('/media/data/opt/nodejs/lib/node_modules/mongoose');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
//var config = require('./config.js');

var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var router = express.Router();

router.get('/', function (req, res) {            

      mclient.connect(url,function(err,db) {
      if(err){
      console.log("can't connect mongodb");
      }else{
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
