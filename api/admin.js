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

router.get("/random", (req, res) => {
    // ดึงข้อมูล id และ number ทั้งหมดจากตาราง product
    const sql = "SELECT id, number FROM product"; // คำสั่ง SQL เพื่อดึง id และ number
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Error fetching data from product table");
        }

        // ตรวจสอบว่ามีข้อมูลในฐานข้อมูลหรือไม่
        if (results.length === 0) {
            return res.status(404).send("No products found");
        }

        // สุ่ม 5 ผลลัพธ์จากข้อมูล
        const shuffled = results.sort(() => 0.5 - Math.random()); // สุ่มเรียงลำดับ
        const selectedProducts = shuffled.slice(0, 5); // เลือก 5 ผลลัพธ์แรกหลังจากสุ่ม

        res.json(selectedProducts); // ส่งผลลัพธ์กลับไปในรูปแบบ JSON
    });
});

router.post("/rank", (req, res) => {
    const rewards = req.body.rewards;
  
    // แปลง id ที่เป็น string ให้เป็น int
    const rewardIds = rewards.map(reward => parseInt(reward.id, 10)); // แปลง id เป็น int
    console.log(rewardIds)
    if (!rewardIds || rewardIds.length !== 5) {
      return res.status(400).send("Invalid request. 5 rewards are required.");
    }
  
    const sql = `UPDATE product SET status = CASE id
      WHEN ? THEN 1
      WHEN ? THEN 2
      WHEN ? THEN 3
      WHEN ? THEN 4
      WHEN ? THEN 5
      END
      WHERE id IN (?, ?, ?, ?, ?)`;
  
    db.query(sql, [...rewardIds, ...rewardIds], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Error updating product status.");
      }
  
      res.send("Product status updated successfully.");
    });
  });
  
  

module.exports = router;
