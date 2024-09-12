const express = require("express");
const mysql = require("mysql");
const http = require("http");
const app = require("./app");

const port = process.env.port || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// เชื่อมต่อกับฐานข้อมูล
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database.');
// });

// รันเซิร์ฟเวอร์
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
