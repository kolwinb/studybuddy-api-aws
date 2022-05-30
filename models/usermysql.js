var mysql = require('/media/data/opt/nodejs/lib/node_modules/mysql');

var pool = mysql.createPool({ host:"192.168.1.120", user:"studybuddy", password:"9t9tpMHIpPHo",database: "studybuddy",debug:false});
module.exports = pool;
