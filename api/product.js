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

module.exports = router;
