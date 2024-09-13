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
  // let details = {
  //   email: req.body.email,
  //   password: req.body.password,
  // };

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const sql = "SELECT * FROM user WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
    if (result.length === 0) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }
    res.json({ status: true, message: "Login successful", user: result[0] });
  });
});

router.post("/register", (req, res) => {
  let details = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  let sql = "INSERT INTO user SET ?";
  db.query(sql, details, (error) => {
    if (error) {
      console.error("Database error:", error); // Log the error
      res.send({ status: false, message: "Register created Failed" });
    } else {
      res.send({ status: true, message: "Register created successfully" });
    }
  });
});


module.exports = router;
