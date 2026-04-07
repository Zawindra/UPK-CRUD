import db from "../db.js";

// Ambil semua transaksi
export const getTransactions = (req, res) => {
  const q = "SELECT * FROM transactions ORDER BY date DESC";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Tambah transaksi baru
export const addTransaction = (req, res) => {
  const q = "INSERT INTO transactions (`description`, `amount`, `type`, `category`, `date`) VALUES (?)";
  const values = [
    req.body.description,
    req.body.amount,
    req.body.type,
    req.body.category,
    req.body.date,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json("Transaksi berhasil ditambahkan.");
  });
};

// Hapus transaksi
export const deleteTransaction = (req, res) => {
  const transactionId = req.params.id;
  const q = "DELETE FROM transactions WHERE id = ?";

  db.query(q, [transactionId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Transaksi berhasil dihapus.");
  });
};