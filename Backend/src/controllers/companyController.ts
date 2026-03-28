import { Response, NextFunction } from "express";
import Company from "../models/Company";
import { AuthRequest } from "../middleware/authMiddleware";
import ErrorResponse from "../utils/errorResponse";
import cloudinary from "../config/cloudinary";

// GET Company Profile
export const getCompanyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const company = await Company.findById(req.user.companyId).select("-password");

  if (!company)
    return next(new ErrorResponse("Company not found", 404));

  res.json({ success: true, count: 1, data: company });
};

// UPDATE Company Profile
export const updateCompanyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findById(req.user.companyId);

    if (!company)
      return next(new ErrorResponse("Company not found", 404));

    company.name = req.body.name || company.name;
    company.email = req.body.email || company.email;

    if (req.file) {
      const file = req.file;
      const publicId = `company_logo_${company._id}_${Date.now()}`;

      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: `hiresphere/companies/${company._id}`,
            public_id: publicId,
            type: "upload"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      company.logoUrl = uploadResult.secure_url;
    }

    await company.save();

    res.json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error: any) {
    next(new ErrorResponse(error.message || "Server Error", 500));
  }
};