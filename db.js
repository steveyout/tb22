var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost:3306',
    user: 'root',
    password: 'android908',
    database: 'telegram'
});
connection.connect();
module.exports = connection;