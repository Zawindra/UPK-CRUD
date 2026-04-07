import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Gunakan createPool agar koneksi lebih stabil dan tidak gampang "closed"
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "upk_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Cek koneksi awal
db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ DB Error:", err.message);
  } else {
    console.log("✅ Database Connected with Connection Pool");
    connection.release(); // Kembalikan koneksi ke pool
  }
});

export default db;