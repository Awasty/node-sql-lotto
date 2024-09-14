const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit: 10, // จำกัดจำนวน connection
    host: "brivcabl2b36lu4euyjn-mysql.services.clever-cloud.com",
    user: "ur8fge8bozwybkba",
    password: "64Wk9JJCjjBGR6wP6uZP",
    database: "brivcabl2b36lu4euyjn",
    port: 3306
});

db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }

    if (connection) connection.release(); // ปล่อย connection เมื่อไม่ได้ใช้

    console.log("Connected to the database.");
    return;
});

db.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

db.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

module.exports = db;
