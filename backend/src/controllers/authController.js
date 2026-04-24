import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/sendEmail.js";

// 🔹 Signup
export const signup = async (req, res) => {
  const { name,email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.json({ success: true, message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

   await sendOTPEmail(user.email, otp);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      user: {
        name: user.name,   // ✅ FIXED
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
  console.error("🔥 LOGIN ERROR:", err);  
  res.status(500).json({ error: err.message });
}
};

// 🔹 Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (
      !user ||
      user.otp !== otp ||
      new Date(user.otpExpiry) < new Date()
    ) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};