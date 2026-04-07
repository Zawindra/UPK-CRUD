import express from "express";
import db from "../db.js";

const router = express.Router();

// GET ALL
router.get("/", (req, res) => {
  const q = "SELECT * FROM transactions ORDER BY date DESC";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

// POST NEW
router.post("/", (req, res) => {
  const { description, amount, type, category, date } = req.body;
  const q = "INSERT INTO transactions (`description`, `amount`, `type`, `category`, `date`) VALUES (?, ?, ?, ?, ?)";
  const values = [description, amount, type, category, date];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json(err);
    }
    return res.status(201).json("Berhasil!");
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  const q = "DELETE FROM transactions WHERE id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Terhapus!");
  });
});

router.put("/:id", (req, res) => {
  const { description, amount, type, category, date } = req.body;
  const q = "UPDATE transactions SET `description`=?, `amount`=?, `type`=?, `category`=?, `date`=? WHERE id=?";
  const values = [description, amount, type, category, date, req.params.id];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Berhasil diperbarui!");
  });
});

export default router;