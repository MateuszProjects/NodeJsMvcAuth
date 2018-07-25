const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123Az',
    database: 'sys'
});

module.exports = connection;