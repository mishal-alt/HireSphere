import Candidate from "../models/Candidate";

/**
 * SignatureService handles the digital signing workflow.
 * Currently supports a "Simulation Mode" for testing, 
 * but structured to easily plug in DocuSign or HelloSign SDKs.
 */
export const initiateSignatureRequest = async (candidateId: string, offerUrl: string) => {
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) throw new Error("Candidate not found");

        console.log(`[SignatureService] 🖋️ Initiating signature request for ${candidate.name}`);
        console.log(`[SignatureService] 📄 Offer Doc: ${offerUrl}`);

        /**
         * REAL INTEGRATION (Example with HelloSign/Dropbox Sign):
         * const response = await helloSign.signatureRequest.send({
         *    test_mode: 1,
         *    title: 'Offer Letter - HireSphere',
         *    subject: 'Your Offer Letter from HireSphere',
         *    message: 'Please sign this document to finalize your employment.',
         *    signers: [{ email_address: candidate.email, name: candidate.name }],
         *    files: [offerUrl]
         * });
         * return response.signature_request.signature_request_id;
         */

        // SIMULATION MODE: Use a mock signature ID for now
        const mockSignatureId = `sig_mock_${Date.now()}`;
        
        candidate.signatureId = mockSignatureId;
        await candidate.save();

        return mockSignatureId;
    } catch (error) {
        console.error("[SignatureService] ❌ Failed to initiate signature:", error);
        throw error;
    }
};

/**
 * processSignatureWebhook handles the callback when a document is signed.
 */
export const handleSignatureComplete = async (signatureId: string) => {
    try {
        const candidate = await Candidate.findOne({ signatureId });
        if (!candidate) {
            console.warn(`[SignatureService] ⚠️ No candidate found for signature ID: ${signatureId}`);
            return;
        }

        // Finalize the hire
        candidate.status = "Hired (Signed)" as any;
        await candidate.save();

        console.log(`[SignatureService] ✅ Candidate ${candidate.name} is now HIRED (SIGNED)`);
        
        return candidate;
    } catch (error) {
        console.error("[SignatureService] ❌ Error processing completion webhook:", error);
        throw error;
    }
};
