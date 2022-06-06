//mysql model
var pool = require('../../models/usermysql.js');

//error module
var error = require('../lib/error');

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
	//properties
	whereEmail: "SELECT * FROM ?? WHERE email = ?",
	whereEmailOrPhone: "SELECT * FROM ?? WHERE email = ? OR phone = ?",
	whereEmailPasswd: "SELECT * FROM ?? WHERE email = ? and password = ?",
	wherePhonePasswd: "SELECT * FROM ?? WHERE phone = ? and password = ?",
	selectAll: "SELECT * FROM ??",
	whereProvince:"SELECT id,name FROM ?? WHERE province_id = ?",
	whereDistrict:"SELECT id,name FROM ?? WHERE district_id = ?",
	insertUser:"INSERT INTO  ??(email,password,username,phone,date_joined,last_login,uniqid,is_active,id) VALUES (?,?,?,?,?,?,?,?,?)",	
	insertOauth:"INSERT INTO ??(id,token,created,updated,user_id) VALUES(?,?,?,?,?)",
	updateOauth:"UPDATE ?? SET token=?, updated=? WHERE user_id=?",
	//methods
	
	setUpdateOauth: function(query,fields,callback){
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					log.error("db update error");
					callback(false);
				} else {
					log.info("db update done");
					callback(true);
				}
 			});
			con.release();
 		});
	
	},
	setUserSqlQuery: function(query,fields,callback) {
//		log.info("setSqlQuery -> Fields : "+fields+" : query : "+query);
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				callback(result);
//				log.info("sql result : "+result[0].email);
 			});
			con.release();
 		});
 	},
 	
 	setUserInsert: function(query,fields,callback) {
		log.info("setSqlQuery -> Fields : "+fields+" : query : "+query);
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
				if (err) {
					log.error(fields[0]+" : user insert error");
					callback(false);
				} else {
					log.info(fields[0]+" : user inserted");
					callback(true);
				}
//				callback(err);
//				log.info("sql result : "+result[0].email);
 			});
			con.release();
 		});
 	},
 	
 		
	//query any table
	getSelectAll: function(query,fields,callback) {
		getConnection(function(con) {
			con.query(query,fields, function (err,result){
   				if (!result[0]){
   					callback(JSON.stringify(error.server()));
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
	}
}


module.exports = dbStatements;                                    
