var express = require('../lib/node_modules/express');
var mclient = require('../lib/node_modules/mongodb').MongoClient;
//var jwt = require('../lib/node_modules/jsonwebtoken');
var cors = require('../lib/node_modules/cors'); //cross-origin-resource-sharing


var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var router = express.Router();

router.use(cors());

router.get('/', function (req, res) {            
      res.header("Access-Control-Allow-Origin","http://dev.learntv.lk");
result = {
api_version :"v1.2",
environment :"Production",
organization : "Dharmavahini Foundation"
}
         res.end(JSON.stringify(result)); 

});

module.exports = router
