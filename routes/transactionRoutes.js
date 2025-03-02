const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Get Transactions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Add Transaction
router.post("/add", authMiddleware, async (req, res) => {
  const { type, amount, category } = req.body;

  try {
    const newTransaction = new Transaction({ userId: req.user.id, type, amount, category });
    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction" });
  }
});

module.exports = router;
