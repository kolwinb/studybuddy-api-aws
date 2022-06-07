const axios = require('/media/data/opt/nodejs/lib/node_modules/axios');
const varErr = require('./status');

exports.api  = function (data,url,callback) {

	const options = {
		headers:{'content-type':'Application/json'}
		};

	console.log("axio.api : data : "+ data);

	axios.post(url,data,options)
	.then(res => {
		//custom error handling
		//return of the operator response to client

		varErr.customError(res.data,function(errCallback) {
			console.log("axios.costomError : custom error handler");
			console.log("errCallback: "+JSON.stringify(errCallback));
			return callback(errCallback);
			});
		})

		
	.catch(error => {
		return callback(varErr.server);
		});


/*
		testData = {
			"statusCode":"S1000",
			"referenceNo":"sldkfjll234k2jl234"
		}

		return callback(testData)	
*/
}
