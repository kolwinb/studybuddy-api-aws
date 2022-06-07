var https = require("https");
const status=require('./status');
//module.exports = function (data,url,path,callback) {
exports.api  = function (data,url,path,callback) {
	var retData='';
	const options = {
		hostname: url,
		port: 443,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
//			'Content-Length': data.length
			}
		}

//	return "success";
//	console.log("operator: "+options);
//	console.log("operator: "+data);
	const httpreq = https.request(options, resp => {
	let res_data = '';
		//console.log('statusCode:', res.statusCode);
		//console.log('headers:', res.headers);

		// A chunk of data has been received.
		resp.on('data', (d) => {
			res_data += d;
			console.log("chunk done");
		});
	
		resp.on('end', () => {
//			console.log("https data recieved: "+res_data);
			return callback(JSON.parse(res_data));

		});
	});

	httpreq.on('error', error => {
		console.error(error)
		return callback(JSON.parse(status.operator));
	});

	httpreq.write(data);
	httpreq.end();
}
