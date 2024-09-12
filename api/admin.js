const express = require("express");
const db = require("../dbconnect");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    const sql = "select * from product"; // คำสั่ง SQL เพื่อดึงข้อมูลจากตาราง user
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Error fetching data from user table");
      }
      res.json(results); // ส่งข้อมูลที่ดึงมาในรูปแบบ JSONgit branch -r
    });
  });

router.get("/add", (req, res) => {
    const numbers = [];
    const today = new Date();
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)).toISOString().split('T')[0];

    // Generate 20 random numbers
    for (let i = 0; i < 100; i++) {
        const number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        numbers.push([number, date]);
    }

    const sql = "INSERT INTO product (number, date) VALUES ?"; // SQL query for bulk insert

    db.query(sql, [numbers], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Error inserting data into product table");
        }
        res.status(201).send(`Successfully inserted ${result.affectedRows} rows`);
    });
});

// router.delete("/delete", (req, res) => {
//     const sql = "DELETE FROM product"; // SQL query to delete all records

//     db.query(sql, (err, result) => {
//         if (err) {
//             console.error("Error executing query:", err);
//             return res.status(500).send("Error deleting data from product table");
//         }
//         res.status(200).send(`Successfully deleted ${result.affectedRows} rows from product table`);
//     });
// });

router.delete("/delete", (req, res) => {
    const sql = "DELETE FROM product"; // SQL query to delete all records

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Error deleting data from product table");
        }

        // Now reset the AUTO_INCREMENT value
        const resetSql = "ALTER TABLE product AUTO_INCREMENT = 1";
        db.query(resetSql, (err, resetResult) => {
            if (err) {
                console.error("Error resetting AUTO_INCREMENT:", err);
                return res.status(500).send("Error resetting AUTO_INCREMENT");
            }
            res.status(200).send(`Successfully deleted ${result.affectedRows} rows and reset AUTO_INCREMENT`);
        });
    });
});


module.exports = router;
