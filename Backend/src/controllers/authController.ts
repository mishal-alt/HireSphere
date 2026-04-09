import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company";
import User, { UserRole } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import ErrorResponse from "../utils/errorResponse";

// Company Registration
export const registerCompany = async (req: Request, res: Response, next: NextFunction) => {
  const { name, fullName, password } = req.body;
  const email = req.body.email?.toLowerCase().trim();

  // Check if company email exists
  const existingCompany = await Company.findOne({ email });
  if (existingCompany)
    return next(new ErrorResponse("Company email already registered", 400));

  // Check if user email also exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new ErrorResponse("User email already registered", 400));

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
    success: true,
    token: accessToken,
    user: {
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      companyId: adminUser.companyId,
      department: adminUser.department,
      profileImage: adminUser.profileImage,
    },

  });
};

// Login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase().trim();

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorResponse("Invalid credentials", 400));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return next(new ErrorResponse("Invalid credentials", 400));


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
    success: true,
    token: accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      department: user.department,
      profileImage: user.profileImage,
    },

  });
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;

  if (!token) return next(new ErrorResponse("No refresh token", 401));

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh") as string
  ) as any;

  const user = await User.findById(decoded.id);
  if (!user) return next(new ErrorResponse("User not found", 401));

  const newAccessToken = generateAccessToken({
    id: user._id.toString(),
    role: user.role,
    companyId: user.companyId.toString(),
  });

  res.json({ success: true, token: newAccessToken });
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};