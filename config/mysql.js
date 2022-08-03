const mysql = require("mysql");
require('dotenv').config();
const env = process.env;

const mysqlConnection = {
    init: function () {
        return mysql.createConnection({
            host: env.HOST,
            port: env.MYSQL_PORT,
            user: env.USER,
            password: env.PASSWORD,
            database: env.DATABASE,
            charset: env.CHARSET
        });
    },
    open: function (conn) {
        conn.connect(function (err) {
            if (err) {
                console.error('MySQL connection failed.');
                console.error('Error Code : ' + err.code);
                console.error('Error Message : ' + err.message);
            } else {
                console.log('MySQL connection successful.');
            }
        });
    }
    ,
    close: function (conn) {
        conn.end(function (err) {
            if (err) {
                console.error('MySQL Terminate failed.');
                console.error('Error Code : ' + err.code);
                console.error('Error Message : ' + err.message);
            } else {
                console.log("MySQL Terminate connection.");
            }
        });
    }
};

module.exports = mysqlConnection;