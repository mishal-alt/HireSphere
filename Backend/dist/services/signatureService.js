"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateSignatureRequest = exports.applyInHouseSignature = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const pdf_lib_1 = require("pdf-lib");
const Candidate_1 = __importDefault(require("../models/Candidate"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
/**
 * applyInHouseSignature handles the "Path 2" (Free) signature logic.
 * It takes a signature image (Base64) and stamps it onto the PDF.
 */
const applyInHouseSignature = async (candidateId, signatureData, // Base64 string from canvas
metadata) => {
    try {
        const candidate = await Candidate_1.default.findById(candidateId);
        if (!candidate || !candidate.offerLetterUrl) {
            throw new Error("Candidate or offer letter not found");
        }
        let existingPdfBytes;
        // 1. Load the original PDF (Handle both URL and Local Path)
        if (candidate.offerLetterUrl.startsWith("http")) {
            console.log(`[SignatureService] 🌐 Fetching remote PDF: ${candidate.offerLetterUrl}`);
            const response = await axios_1.default.get(candidate.offerLetterUrl, { responseType: 'arraybuffer' });
            existingPdfBytes = new Uint8Array(response.data);
        }
        else {
            const pdfPath = path_1.default.isAbsolute(candidate.offerLetterUrl)
                ? candidate.offerLetterUrl
                : path_1.default.join(process.cwd(), candidate.offerLetterUrl);
            if (!fs_1.default.existsSync(pdfPath)) {
                throw new Error(`Original PDF not found at path: ${pdfPath}`);
            }
            existingPdfBytes = fs_1.default.readFileSync(pdfPath);
        }
        const pdfDoc = await pdf_lib_1.PDFDocument.load(existingPdfBytes);
        // 2. Embed the Signature Image
        const base64Data = signatureData.includes(',') ? signatureData.split(',')[1] : signatureData;
        const signatureImageBytes = Buffer.from(base64Data, 'base64');
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
        const signatureDims = signatureImage.scale(0.3); // Scale down to fit 
        // 3. Find the last page and stamp it
        const pages = pdfDoc.getPages();
        const lastPage = pages[pages.length - 1];
        lastPage.drawImage(signatureImage, {
            x: 350,
            y: 110,
            width: signatureDims.width,
            height: signatureDims.height,
        });
        // 4. Save the "Executed" version
        const signedPdfBytes = await pdfDoc.save();
        // 5. Upload Signed Version to Cloudinary (since original was remote)
        console.log(`[SignatureService] ☁️ Uploading signed PDF to Cloudinary...`);
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({
                resource_type: "raw",
                folder: `hiresphere/${candidate.companyId}/signed_offers`,
                public_id: `signed_offer_${candidate.name.replace(/\s+/g, "_")}_${Date.now()}`,
                format: "pdf"
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(Buffer.from(signedPdfBytes));
        });
        // 6. Update Database Record with Audit Trail
        candidate.status = "Hired (Signed)";
        candidate.offerLetterUrl = uploadResult.secure_url; // Use Cloudinary URL
        candidate.signatureDate = new Date();
        candidate.signatureIp = metadata.ip;
        candidate.signatureUserAgent = metadata.userAgent;
        await candidate.save();
        console.log(`[SignatureService] ✅ In-house signature applied for ${candidate.name}`);
        return candidate;
    }
    catch (error) {
        console.error("[SignatureService] ❌ In-house signature failed:", error.message);
        throw error;
    }
};
exports.applyInHouseSignature = applyInHouseSignature;
/**
 * initiateSignatureRequest (Optional/Simulation Mode)
 * Used if you still want to mock the 'sending' process.
 */
const initiateSignatureRequest = async (candidateId, offerUrl) => {
    try {
        const candidate = await Candidate_1.default.findById(candidateId);
        if (!candidate)
            throw new Error("Candidate not found");
        console.log(`[SignatureService] 🖋️ Initiating internal signature request for ${candidate.name}`);
        // Mark as "Offered" if not already
        candidate.status = "Offered";
        candidate.offerLetterUrl = offerUrl;
        await candidate.save();
        return candidate;
    }
    catch (error) {
        console.error("[SignatureService] ❌ Failed to initiate request:", error);
        throw error;
    }
};
exports.initiateSignatureRequest = initiateSignatureRequest;
