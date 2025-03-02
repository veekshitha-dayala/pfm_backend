const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Required for parsing JSON requests

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);


// ✅ Define Transaction Schema
const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  category: String,
  date: Date,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// ✅ Get All Transactions (Frontend Fetches This)
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// ✅ Add a New Transaction (Fix for "Failed to add transaction")
app.post("/api/transactions/add", async (req, res) => {
  try {
    const { type, amount, category, date } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTransaction = new Transaction({ type, amount, category, date });
    await newTransaction.save();

    res.status(201).json({ message: "Transaction added successfully" });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Error adding transaction", error });
  }
});

// ✅ Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
