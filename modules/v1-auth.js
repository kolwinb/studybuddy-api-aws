var express = require('/media/data/opt/nodejs/lib/node_modules/express');
var mclient = require('/media/data/opt/nodejs/lib/node_modules/mongodb').MongoClient;
var Server = require('/media/data/opt/nodejs/lib/node_modules/mongodb').Server;
var bodyParser = require('/media/data/opt/nodejs/lib/node_modules/body-parser');
var morgan = require('/media/data/opt/nodejs/lib/node_modules/morgan');
var mongoose = require('/media/data/opt/nodejs/lib/node_modules/mongoose');
var jwt = require('/media/data/opt/nodejs/lib/node_modules/jsonwebtoken');
var config = require('./config.js');

//mongomodel
var userinfo = require('./app/models/user.js');

//mysql model
var pool = require('./app/models/usermysql.js');

//var mysql = require('/media/data/opt/nodejs/lib/node_modules/mysql');
//var con = mysql.createConnection({ host:"192.168.1.120", user:"cb", password:"ltv9201712",database: "learntv_schema"});
var url = "mongodb://192.168.1.110:27017/learntvapi";
var app = express();
var fs = require("fs");
var api = express.Router();
//app.use('/api',api);

var port = process.env.PORT || 8082;
//mongoose.connect(config.database);
//app.set('sec',config.secret);

// get url parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// morgan used to log requests on console
app.use(morgan('dev'));
app.use(bodyParser());

//using privatekey
var cert=fs.readFileSync('private.pem');

app.post('/session',function(req,res,next) {
   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
   if (rtoken) {
jwt.verify(rtoken,cert,{aud:'urn:studes'},function(err,decoded)
{
     if (err){
       res.json({success:false});
       console.log(decoded);
     }else {
       req.decoded = decoded;
       res.json({success:true,signature:'valid'});
    }
    });
    } else {
       return res.status(403).send({ success: false,message:'No token provided.'});
  }

 });


//mysql 
app.post('/authenticate',function(req,res){

    pool.getConnection(function(err,con){
    

    if (err) {
    con.release();
    console.log('connection pool error');
    throw err;
    } else {
    con.query("SELECT * FROM users WHERE email = ?",[req.body.txtemail], function (err,result,fields){
       if (!result[0]){
           res.json({success: false, message: 'Authentication failed. User not found.'});
       } else {
         var token = jwt.sign({
                                iss:"learntv",
                                aud:"students",
                                exp: Math.floor(Date.now()/1000)+(60*60),
                                email:result[0].email},cert);
       res.json({success: true, message:'token has release', token: token});
       }
///console.log(result.length)
//con.release();
con.release();
});
}
/*
con.on('error',function(err) {
   throw err;
   return;
});
*/
});
});

//});
//mongodb authentication
/*
mapp.post('/authenticate', function(req, res) {
   userinfo.findOne({password:req.body.txtpassw},function(err,user) {
   if (err) throw err;
   if (!user) {
      res.json({success: false, message: 'Authentication failed. User not found.'});
   } else if (user) {
   if (user.password != req.body.txtpassw){
      res.json({ success: false, message:'Authentication failed. Wrong password.'});
   } else {
         var token = jwt.sign({
                                iss:"learntv",
                                aud:"students",
                                exp: Math.floor(Date.now()/1000)+(60*60),
                                email:user.email,
                                password:user.password },cert);
       res.json({success: true, message:'token has release', token: token})

}
} 
});
});
*/

app.get('/users',function(req, res){
    userinfo.find({},function(err, users) {
      res.json(users);
    });
});

//mysql db

app.post('/register',function(req,res){
//    if (err) throw err;  
    pool.getConnection(function(err,con){
    if (err) {
        con.release();
        throw rr;
    } else {
    console.log(req.body.txtemail)
    con.query("SELECT email FROM users WHERE email= ?",[req.body.txtemail], function (err,result,fields){
       if (!result.length){
           console.log("not found"); 
           con.query("INSERT INTO users (email) VALUES (?)",[req.body.txtemail],function (err, result)
          {
         if (err) console.log('sql insert not working');
            console.log('User saved successfully');
            res.json({success: true,message:'User registered'});
       
    });
 

       }else if (result[0].email) {
           res.json({success:false,message:'Registration failed. User found.'}); 
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

//mongo db create sample user
/*
app.post('/registe',function(req,res) {
   userinfo.findOne({email:req.body.txtemail},function(err,user){
   if (err) throw err;
   if (user) {
       res.json({success:false,message:'Registration failed. User found.'}); 
   } else {
    var nuser = new userinfo({
      email:req.body.txtemail,
      password:req.body.txtpassw
   });
    nuser.save(function(err){
       if(err) throw err;
       console.log('User saved successfully');
       res.json({success: true,message:'User registered'});

       
});
}
});
});
*/

app.post('/login', function(req,res){
      console.log(req.body.txtname);
      res.send(req.body.txtname);
      res.send(req.headers.authorization);
     });

app.get('/playlist', function (req, res) {            
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


 var server = app.listen(8082, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)


})
