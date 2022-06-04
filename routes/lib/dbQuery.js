//mysql model
var pool = require('../../models/usermysql.js');

//error module
var errState = require('../lib/error');

//log module
var log = require('../lib/log');

var getConnection = function(callback) {
	pool.getConnection(function(err, connection) {
		if(err){
	 		throw err;
//  			log.error("Mysql Connection Error");
  		} else {
  			callback(connection);                                                                       
  		}
  	});                 
  };
                                                          
                                                          

var dbStatements = {
	hasEmailPass: function(email,passwd) {
		getConnection.query("SELECT * FROM ?? WHERE email = ? and password = ?",[tablename,email,password], function (err,result){
   			if (!result[0]){
   				return False;
 			} else if (result[0].is_active == 1) {
				return True; 		
			}
 		});
 		getConnection.release();
	},
	//query any table
	getSelectAll: function(tblName,callback) {
		getConnection(function(con) {
			con.query("SELECT * FROM ??",[tblName], function (err,result){
   				if (!result[0]){
   					callback(JSON.stringify(errState.dbQuery()));
 				} else {
 					//single row
 					//var normalObj = Object.assign({}, results[0]);
					var jsonResults = result.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					});
//					log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},
	//query any table with foreign key constrain
	getDistrict: function(tblName,foreignKey,callback) {
		getConnection(function(con) {
			con.query("SELECT id,name FROM ?? WHERE province_id=?",[tblName,foreignKey], function (err,result){
   				if (!result[0]){
   					callback(JSON.stringify(errState.dbQuery()));
 				} else {
					var jsonResults = result.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					});

//					log.info(JSON.stringify(jsonResults));
					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	},
	//query any table with foreign key constrain
	getSchool: function(tblName,foreignKey,callback) {
		getConnection(function(con) {
			con.query("SELECT id,name FROM ?? WHERE district_id=?",[tblName,foreignKey], function (err,result){
   				if (!result[0]){
   					callback(JSON.stringify(errState.dbQuery()));
 				} else {
					var jsonResults = result.map((mysqlObj, index) => {
    						return Object.assign({}, mysqlObj);
    					});

					callback(JSON.stringify(jsonResults)); 		
			}
		});
		con.release();
	});
	}
}


module.exports = dbStatements;                                    
