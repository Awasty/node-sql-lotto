const express = require("express");
const db = require("../dbconnect");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  const sql = "select * from user"; // คำสั่ง SQL เพื่อดึงข้อมูลจากตาราง user
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Error fetching data from user table");
    }
    res.json(results); // ส่งข้อมูลที่ดึงมาในรูปแบบ JSONgit branch -r
  });
});

//Login
router.post("/login", (req, res) => {
  let details = {
      email: req.body.email,
      password: req.body.password,
  };
  const sql = "SELECT * FROM user WHERE email = ? AND password = ?";

  conn.query(sql, [details.email, details.password], (error, result) => {
      if (error) {
          res.status(400).json({ status: false, message: "Login created Failed", error: error });
      } else {
          res.json(result);
      }
  });
});

// Register
router.post("/register", (req, res) => {
  let details = {
    user: req.body.user,
    email: req.body.email,
    password: req.body.password,

  };
  let sql = "INSERT INTO user SET ?";
  conn.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "Register created Failed" });
    } else {
      res.send({ status: true, message: "Register created successfully" });
    }
  });
});

module.exports = router;
