const mysql = require('mysql');

const db = mysql.createConnection({
    host: "brivcabl2b36lu4euyjn-mysql.services.clever-cloud.com",  // host ของฐานข้อมูล
    user: "ur8fge8bozwybkba",  // ชื่อผู้ใช้
    password: "64Wk9JJCjjBGR6wP6uZP",  // รหัสผ่าน
    database: "brivcabl2b36lu4euyjn",  // ชื่อฐานข้อมูล
    port: 3306  // พอร์ตของ MySQL
  });
  db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database.3");
    // db.query('SELECT * FROM user', (err, results) => {
    //     if (err) {
    //         console.error('Error executing query:', err);
    //     } else {
    //         console.log(results); // แสดงข้อมูลที่ได้จากฐานข้อมูล
    //     }
    // });
});

module.exports = db;