"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanyProfile = exports.getCompanyProfile = void 0;
const Company_1 = __importDefault(require("../models/Company"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// GET Company Profile
const getCompanyProfile = async (req, res, next) => {
    const company = await Company_1.default.findById(req.user.companyId).select("-password");
    if (!company)
        return next(new errorResponse_1.default("Company not found", 404));
    res.json({ success: true, count: 1, data: company });
};
exports.getCompanyProfile = getCompanyProfile;
// UPDATE Company Profile
const updateCompanyProfile = async (req, res, next) => {
    try {
        const company = await Company_1.default.findById(req.user.companyId);
        if (!company)
            return next(new errorResponse_1.default("Company not found", 404));
        company.name = req.body.name || company.name;
        company.email = req.body.email || company.email;
        if (req.file) {
            const file = req.file;
            const publicId = `company_logo_${company._id}_${Date.now()}`;
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({
                    resource_type: "image",
                    folder: `hiresphere/companies/${company._id}`,
                    public_id: publicId,
                    type: "upload"
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
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
    }
    catch (error) {
        next(new errorResponse_1.default(error.message || "Server Error", 500));
    }
};
exports.updateCompanyProfile = updateCompanyProfile;
