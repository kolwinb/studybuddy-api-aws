var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var mclient = require('/media/data/opt/nodejs/lib/node_modules/mongodb').MongoClient;
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var cors = require('/media/data/opt/nodejs/lib/node_modules/cors'); //cross-origin-resource-sharing


var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var router = express.Router();
var http = require('http'); 
var https = require('https'); 

router.use(cors());

var XMLHttpRequest=require('/media/data/opt/nodejs/lib/node_modules/xmlhttprequest').XMLHttpRequest;
var parseString = require ('/media/data/opt/nodejs/lib/node_modules/xml2js').parseString;

var fs = require("fs");
var cert=fs.readFileSync('private.pem');


router.post('/', function (req, res) {    
   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {
jwt.verify(rtoken,cert,{aud:'urn:studes'},function(err,decoded)
{
     if (err){
       res.json({success:false,signature:"invalid"});
       console.log(decoded);
     }else {
       req.decoded = decoded;


var addurl = "http://revive.vhec.lk/revive/www/delivery/fc.php?script=bannerTypeHtml:vastInlineBannerTypeHtml:vastInlineHtml&format=vast&nz=1&zones=pre-roll%3D14";
http.get(addurl,function(result) {
//console.log(result.statusCode);
//console.log();
var get_data='';

result.on('data',function(chunk){
get_data += chunk;
});

result.on('end',function(){
console.log('request revive adserver');
//console.log(get_data);

//parse string to json format
parseString(get_data, function (err,result){
//console.log(JSON.stringify(result));

try{
var tempvar=result.VideoAdServingTemplate[0];
var addsystem=result.VideoAdServingTemplate.Ad[0].InLine[0].AdSystem[0];
var description=result.VideoAdServingTemplate.Ad[0].InLine[0].Description[0];
var impression=result.VideoAdServingTemplate.Ad[0].InLine[0].Impression[0].URL[0]._;
var duration=result.VideoAdServingTemplate.Ad[0].InLine[0].Video[0].Duration[0];
var videofile=result.VideoAdServingTemplate.Ad[0].InLine[0].Video[0].MediaFiles[0].MediaFile[0].URL[0];
//console.log(result.VideoAdServingTemplate.Ad[0].InLine[0].Video[0].MediaFiles[0].MediaFile[0]);
context={
'addsystem':'Dharmavahini',
'description':description,
'impression':impression,
'duration':duration,
'mediafile':videofile
};

}catch (err){
console.log("Atleast one Advertisment have to link with zone.");
context={
'addsystem':'Dharmavahini',
'description':'Advertisment is not assigning to current zone',
};
}


res.end(JSON.stringify(context));
});
});
});

}
});
}

});

module.exports = router
