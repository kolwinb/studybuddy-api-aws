var mysql = require('../lib/node_modules/mysql');
var log=require('../routes/lib/log');

var pool = mysql.createPool({ host:"172.31.48.100", user:"studybuddy", password:"f763D1DcB+lB",database: "studybuddy",debug:false,multipleStatements:true});

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
