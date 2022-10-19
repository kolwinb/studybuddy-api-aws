var express = require('../../lib/node_modules/express');

var app = express();
var router = express.Router();


router.get('/', function (req, res) {
result = {
api_version :"v1",
environment :"Production",
organization : "Dharmavahini Foundation"
}
         res.end(JSON.stringify(result));

});

module.exports = router
