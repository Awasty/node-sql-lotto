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

router.post("/deposit", (req, res) => {
  const userId = req.body.uid; // รับค่า user id จาก request
  const depositAmount = req.body.amount; // รับจำนวนเงินที่จะเพิ่ม

  // SQL สำหรับการอัปเดตฟิลด์ money ของ user ที่มี userId ตามที่ระบุ
  let updateSql = "UPDATE user SET money = money + ? WHERE id = ?";
  db.query(updateSql, [depositAmount, userId], (error, results) => {
    if (error) {
      console.error("Database error:", error); // Log the error
      res.send({ status: false, message: "Deposit failed" });
    } else if (results.affectedRows === 0) {
      // ถ้าไม่มีการอัปเดต (ไม่มี user ที่ตรงกับ id)
      res.send({ status: false, message: "User not found" });
    } else {
      // หลังจากการอัปเดตสำเร็จ ให้ทำการ SELECT เพื่อนำค่า money กลับมา
      let selectSql = "SELECT money FROM user WHERE id = ?";
      db.query(selectSql, [userId], (error, results) => {
        if (error) {
          console.error("Database error during SELECT:", error); // Log the error
          res.send({ status: false, message: "Error retrieving money" });
        } else if (results.length === 0) {
          res.send({ status: false, message: "User not found after deposit" });
        } else {
          const remainingMoney = results[0].money; // ดึงค่าจำนวนเงินที่เหลือ
          res.send({ 
            status: true, 
            message: "Deposit successful", 
            remainingMoney: remainingMoney // ส่งค่าจำนวนเงินกลับไปด้วย
          });
        }
      });
    }
  });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // ตรวจสอบว่า email มีอยู่ใน database หรือไม่
  let checkEmailSql = "SELECT * FROM user WHERE email = ?";
  db.query(checkEmailSql, [email], (error, result) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).send({ status: false, message: "Database error" });
    }

    if (result.length > 0) {
      // ถ้าอีเมลมีอยู่แล้วใน database
      return res.status(409).send({ status: false, message: "Email already exists" });
    }

    // ถ้าอีเมลไม่ซ้ำ ทำการ INSERT ลงใน database
    let details = { name, email, password };
    let insertSql = "INSERT INTO user SET ?";
    db.query(insertSql, details, (error) => {
      if (error) {
        console.error("Database insert error:", error); // Log the error
        return res.status(500).send({ status: false, message: "Register created failed" });
      }
      res.status(201).send({ status: true, message: "Register created successfully" });
    });
  });
});





module.exports = router;
