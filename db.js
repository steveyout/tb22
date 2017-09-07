var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'android908',
    database: 'telegram'
});
connection.connect();
module.exports = connection;