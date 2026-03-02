import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Company from "../models/Company";
import User, { UserRole } from "../models/User";
import generateToken from "../utils/generateToken";

//  Company Registration
export const registerCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany)
      return res.status(400).json({ message: "Company already exists" });

    const company = await Company.create({
      name,
      email,
      password,
    });

    // Create Admin user for this company
    const adminUser = await User.create({
      name: "Admin",
      email,
      password,
      role: UserRole.ADMIN,
      companyId: company._id,
    });

    const token = generateToken({
      id: adminUser._id.toString(),
      role: adminUser.role,
      companyId: company._id.toString(),
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      companyId: user.companyId.toString(),
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};