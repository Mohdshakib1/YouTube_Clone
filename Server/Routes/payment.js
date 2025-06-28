import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 49900,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    return res.json(order);
  } catch (err) {
    console.error("❌ Razorpay order error:", err.error || err);
    return res.status(500).json({ message: "Order creation failed" });
  }
});

export default router;