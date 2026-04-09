import fs from "fs";
import path from "path";
import axios from "axios";
import { PDFDocument } from "pdf-lib";
import Candidate from "../models/Candidate";
import cloudinary from "../config/cloudinary";

/**
 * applyInHouseSignature handles the "Path 2" (Free) signature logic.
 * It takes a signature image (Base64) and stamps it onto the PDF.
 */
export const applyInHouseSignature = async (
  candidateId: string,
  signatureData: string, // Base64 string from canvas
  metadata: { ip: string; userAgent: string }
) => {
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || !candidate.offerLetterUrl) {
      throw new Error("Candidate or offer letter not found");
    }

    let existingPdfBytes: Uint8Array;

    // 1. Load the original PDF (Handle both URL and Local Path)
    if (candidate.offerLetterUrl.startsWith("http")) {
        console.log(`[SignatureService] 🌐 Fetching remote PDF: ${candidate.offerLetterUrl}`);
        const response = await axios.get(candidate.offerLetterUrl, { responseType: 'arraybuffer' });
        existingPdfBytes = new Uint8Array(response.data);
    } else {
        const pdfPath = path.isAbsolute(candidate.offerLetterUrl) 
                       ? candidate.offerLetterUrl 
                       : path.join(process.cwd(), candidate.offerLetterUrl);

        if (!fs.existsSync(pdfPath)) {
          throw new Error(`Original PDF not found at path: ${pdfPath}`);
        }
        existingPdfBytes = fs.readFileSync(pdfPath);
    }

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

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
    const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: `hiresphere/${candidate.companyId}/signed_offers`,
                public_id: `signed_offer_${candidate.name.replace(/\s+/g, "_")}_${Date.now()}`,
                format: "pdf"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(Buffer.from(signedPdfBytes));
    });

    // 6. Update Database Record with Audit Trail
    candidate.status = "Hired (Signed)" as any;
    candidate.offerLetterUrl = uploadResult.secure_url; // Use Cloudinary URL
    candidate.signatureDate = new Date();
    candidate.signatureIp = metadata.ip;
    candidate.signatureUserAgent = metadata.userAgent;
    await candidate.save();

    console.log(`[SignatureService] ✅ In-house signature applied for ${candidate.name}`);
    return candidate;
  } catch (error: any) {
    console.error("[SignatureService] ❌ In-house signature failed:", error.message);
    throw error;
  }
};

/**
 * initiateSignatureRequest (Optional/Simulation Mode)
 * Used if you still want to mock the 'sending' process.
 */
export const initiateSignatureRequest = async (candidateId: string, offerUrl: string) => {
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) throw new Error("Candidate not found");

        console.log(`[SignatureService] 🖋️ Initiating internal signature request for ${candidate.name}`);
        
        // Mark as "Offered" if not already
        candidate.status = "Offered" as any;
        candidate.offerLetterUrl = offerUrl;
        await candidate.save();

        return candidate;
    } catch (error) {
        console.error("[SignatureService] ❌ Failed to initiate request:", error);
        throw error;
    }
};
