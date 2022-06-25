var mysql = require('/media/data/opt/nodejs/lib/node_modules/mysql');
var log=require('../routes/lib/log');

var pool = mysql.createPool({ host:"192.168.1.120", user:"studybuddy", password:"9t9tpMHIpPHo",database: "studybuddy",debug:false,multipleStatements:true});

var getConnection = function(callback) {
	pool.getConnection(function(err, connection) {
		if(err){
		 throw err;
		 log.error("Mysql Connection Error");		 
		} else {
		callback(connection);
		}
	});
};

module.exports = pool;
