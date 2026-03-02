import { Response } from "express";
import Company from "../models/Company";
import { AuthRequest } from "../middleware/authMiddleware";

// GET Company Profile
export const getCompanyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const company = await Company.findById(req.user.companyId).select(
      "-password"
    );

    if (!company)
      return res.status(404).json({ message: "Company not found" });

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE Company Profile
export const updateCompanyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const company = await Company.findById(req.user.companyId);

    if (!company)
      return res.status(404).json({ message: "Company not found" });

    company.name = req.body.name || company.name;
    company.email = req.body.email || company.email;

    await company.save();

    res.json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};