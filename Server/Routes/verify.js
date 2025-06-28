import express from "express";
import crypto from "crypto";
import User from "../Models/Auth.js";

const router = express.Router();

router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  try {
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        premiumExpiresAt: oneMonthLater,
      },
      { new: true } // ✅ return the updated user
    );

    res.status(200).json({
      success: true,
      premiumExpiresAt: updatedUser.premiumExpiresAt,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isPremium: updatedUser.isPremium,
        premiumExpiresAt: updatedUser.premiumExpiresAt,
      },
    });
  } catch (err) {
    console.error("❌ Premium activation failed", err);
    res.status(500).json({ success: false });
  }
});

export default router;
