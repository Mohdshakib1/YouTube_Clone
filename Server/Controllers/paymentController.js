
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../Models/Auth.js"; 

const razorpay = new Razorpay({
  key_id: "rzp_test_5YBxNR7cwxlViu",
  key_secret: "ibdZlxpIxz5G5e6iE4q84aGz", 
});

export const createOrder = async (req, res) => {
  try {
    const options = {
      amount: 29900, 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

  const hmac = crypto.createHmac("sha256", "ibdZlxpIxz5G5e6iE4q84aGz"); 
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = hmac.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  await User.findByIdAndUpdate(userId, { premiumMember: true });
  res.status(200).json({ success: true });
};
