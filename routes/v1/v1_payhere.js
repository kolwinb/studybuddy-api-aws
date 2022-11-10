var express = require('../../lib/node_modules/express');
var jwt = require('../../lib/node_modules/jsonwebtoken');

const crypto = require('crypto');

var app = express();
var fs = require("fs");
var router = express.Router();

//using privatekey
var cert=fs.readFileSync('private.pem');

//custom jwt module
var jwtModule = require('../lib/jwtToken');
const status = require('../lib/status');
const log = require('../lib/log');
const dbQuery = require('../lib/dbQuery');
const properties = require('../lib/properties');

//api keys
const scope = require('../lib/apiKeys');
const api_key = scope.profileApi.apiKey;
const api_secret = scope.profileApi.apiSecret;

//get current path
//console.log(process.cwd());

router.post('/',function(req,res,next) {
    const merchant_id=req.body.merchant_id;
    const order_id=req.body.order_id;
    const payment_id=req.body.payment_id;
    const payhere_amount=req.body.payhere_amount;
    const payhere_currency=req.body.payhere_currency;
    const status_code=req.body.status_code;
    const md5sig=req.body.md5sig;
    const custom_1=req.body.custom_1;
    const custom_2=req.body.custom_2;
    const method = req.body.method;
    const status_message=req.body.status_message;
    const card_holder_name = req.body.card_holder_name;
    const card_no = req.body.card_no;
    const card_expiry = req.body.card_expiry;

	const merchantSecret='hellobbbb';
	const md5MerchantSecret = crypto.createHash('md5').update(merchantSecret).digest('hex');
	const strMd5=merchant_id+order_id+payhere_amount+payhere_currency+status_code+md5MerchantSecret;
	const md5Local = crypto.createHash('md5').update(strMd5).digest('hex');
	console.log("md5sig : "+md5sig+", md5Local :"+md5Local);

//	if (md5sig == md5Local){
		dbQuery.getSelect(dbQuery.whereOrderPaymentId,[order_id,payment_id],function (callbackOnline){
			//if (!callbackOnline[0]) {
			if (!callbackOnline[0]) {
				dbQuery.setInsert(dbQuery.insertPayhereCallback,[0,order_id,payment_id,payhere_amount,payhere_currency,status_code,custom_1,custom_2],function (callbackInsert){
					if (!callbackInsert){
						//res.send(JSON.parse(satus.server()));
						console.log("payhere callback : insert error");
						res.sendStatus(500);
					} else {
						console.log("payhere callback : insert success");
						res.sendStatus(200);
					}
				});

			} else {
				console.log("payhere callback : update status_code");
				dbQuery.setUpdate(dbQuery.updatePayhere,[status_code,order_id,payment_id],function(callbackUpdate){
					res.sendStatus(409); //conflict
				});
			}
		});
//	} else {
//		res.sendStatus(406); //not acceptable
//	}

 });


module.exports = router
