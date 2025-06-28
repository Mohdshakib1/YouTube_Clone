
import users from "../Models/Auth.js";
import jwt from "jsonwebtoken";



export const login = async (req, res) => {
   const { email, name, profilePic } = req.body;

  if (!email) {
    return res.status(400).json({ mess: "Email is required" });
  }

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      // Create new user
      try {
        const newUser = await users.create({ email });
        const token = jwt.sign(
          {
            email: newUser.email,
            id: newUser._id,
          },
          process.env.JWT_SECRET, // Make sure your .env has JWT_SECRET set correctly
          { expiresIn: "1h" }
        );

        res.status(200).json({ result: newUser, token });
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ mess: "Something went wrong creating user" });
      }
    } else {
      // User exists, create token
      try {
        const token = jwt.sign(
          {
            email: existingUser.email,
            id: existingUser._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({ result: existingUser, token });
      } catch (error) {
        console.error("Error creating token:", error);
        res.status(500).json({ mess: "Something went wrong generating token" });
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ mess: "Something went wrong during login" });
  }

};
