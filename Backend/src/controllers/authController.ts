import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company";
import User, { UserRole } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";

//  Company Registration
export const registerCompany = async (req: Request, res: Response) => {
  try {
    const { name, fullName, email, password } = req.body;

    // Check if company email exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany)
      return res.status(400).json({ message: "Company email already registered" });

    // Check if user email also exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User email already registered" });

    const company = await Company.create({
      name,
      email,
      password,
    });

    // Create Admin user for this company
    const adminUser = await User.create({
      name: fullName || "Admin",
      email,
      password,
      role: UserRole.ADMIN,
      companyId: company._id,
    });

    const accessToken = generateAccessToken({
      id: adminUser._id.toString(),
      role: adminUser.role,
      companyId: company._id.toString(),
    });

    const refreshToken = generateRefreshToken({
      id: adminUser._id.toString(),
      role: adminUser.role,
      companyId: company._id.toString(),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      token: accessToken,
      user: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        companyId: adminUser.companyId,
        department: adminUser.department,
      },
    });
  } catch (error) {
    console.error("Registration Error Details:", error);
    res.status(500).json({ message: "Server Error during registration" });
  }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
      companyId: user.companyId.toString(),
    });

    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
      companyId: user.companyId.toString(),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh") as string
    ) as any;

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const newAccessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
      companyId: user.companyId.toString(),
    });

    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};