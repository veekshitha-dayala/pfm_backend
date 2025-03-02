const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// ✅ Add Income or Expense
router.post("/add", async (req, res) => {
  try {
    const { type, amount, category, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTransaction = new Transaction({ type, amount, category, date });
    await newTransaction.save();

    res.status(201).json({ message: "Transaction added successfully", newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error });
  }
});

// ✅ Get All Transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

module.exports = router;
