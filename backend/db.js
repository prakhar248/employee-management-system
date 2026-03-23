const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // Change to your MySQL username
  password: "nayapassword",         // Change to your MySQL password
  database: "employee_db",

});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database.");
});

module.exports = db;
