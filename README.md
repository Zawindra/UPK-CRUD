# 💰 JO Personal Finance - Fullstack Expense Tracker

**JO Personal Finance** adalah aplikasi manajemen keuangan pribadi berbasis web yang memungkinkan pengguna untuk mencatat pemasukan dan pengeluaran harian secara real-time. Aplikasi ini dibangun dengan arsitektur **Fullstack JavaScript** menggunakan MySQL sebagai penyimpanan data dan Tailwind CSS untuk antarmuka yang modern.

---

## 🚀 Fitur Utama
* **Full CRUD Operations**: Tambah, Lihat, Edit, dan Hapus riwayat transaksi dengan mudah.
* **Real-time Dashboard**: Kartu statistik otomatis yang menghitung **Total Saldo**, **Total Pemasukan**, dan **Total Pengeluaran**.
* **Modern UI/UX**: Tampilan bersih dan responsif menggunakan **Tailwind CSS** dan Font **Poppins**.
* **Dynamic Styling**: Indikator warna otomatis (Merah untuk pengeluaran, Hijau untuk pemasukan).
* **Sticky Form**: Form input tetap berada di posisi yang nyaman saat menelusuri daftar transaksi yang panjang.

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js (Vite)**: Library utama untuk membangun antarmuka pengguna yang reaktif.
* **Tailwind CSS**: Framework CSS untuk styling yang cepat dan modern.
* **Axios**: Library untuk melakukan HTTP Request ke API backend.

### **Backend**
* **Node.js & Express.js**: Runtime dan framework untuk membangun RESTful API.
* **MySQL / MariaDB**: Database relasional untuk penyimpanan data yang persisten.
* **MySQL2**: Driver database dengan dukungan *Connection Pool* untuk performa yang lebih stabil.
* **Dotenv**: Pengelolaan variabel lingkungan (Environment Variables) untuk keamanan data.

---

## ⚙️ Cara Instalasi & Menjalankan

### 1. Persiapan Database
1. Buka phpMyAdmin atau terminal MySQL kamu.
2. Buat database baru bernama `upk_db`.
3. Jalankan perintah SQL berikut untuk membuat tabel transaksi:
```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('pemasukan', 'pengeluaran') NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

