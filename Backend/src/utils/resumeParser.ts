// @ts-ignore
if (typeof global.DOMMatrix === "undefined") {
  global.DOMMatrix = class { constructor() {} } as any;
}
import { PDFParse } from 'pdf-parse';

interface ParseResult {
  atsScore: number;
  matchedSkills: string[];
  resumeText: string;
}

/**
 * Parses a PDF buffer, extracts text, and calculates an ATS score based on required skills.
 * 
 * @param pdfBuffer The raw buffer of the uploaded PDF file
 * @param requiredSkills An array of strings representing the skills required for the job
 * @returns An object containing the score, matched skills, and the raw text
 */
export const parseResume = async (
  pdfBuffer: Buffer, 
  requiredSkills: string[]
): Promise<ParseResult> => {
  try {
    // 1. Extract text from the PDF buffer
    let rawText = '';
    try {
       console.log("[ATS Parser] Starting PDF extraction with PDFParse Class...");
       
       // The installed version of pdf-parse is a newer class-based version (v2.4.5+)
       const parser = new PDFParse({ data: pdfBuffer });
       const result = await parser.getText();
       rawText = result.text || '';
       
       console.log("[ATS Parser] Raw text extracted (length):", rawText.length);
    } catch (parseError) {
        console.error('pdf-parse threw an error:', parseError);
        throw new Error('Could not read the PDF file. It might be corrupted or encrypted.');
    }
    
    // 2. Normalize the resume text
    // We create a version where common dots/hyphens are removed for "nodejs" style matching,
    // and another version where they become spaces to avoid words joining.
    const cleanText = rawText.toLowerCase();
    
    // Version A: dots/hyphens removed entirely (Node.js -> nodejs)
    const condensedText = cleanText.replace(/[.\-]/g, '').replace(/[^\w\s+#]/g, ' ');
    
    // Version B: everything replaced with spaces (C++ -> c++)
    const spacedText = cleanText.replace(/[^\w\s+#]/g, ' ');

    // 3. Logic to check for matching skills
    const matchedSkills: string[] = [];

    // If there are no skills to match against, it defaults to 0%
    if (!requiredSkills || requiredSkills.length === 0) {
      return { atsScore: 0, matchedSkills: [], resumeText: rawText };
    }

    requiredSkills.forEach((skill) => {
      // Create variations of the skill to match against
      const lowerSkill = skill.toLowerCase().trim();
      const condensedSkill = lowerSkill.replace(/[.\-\s]/g, ''); // nodejs
      const spacedSkill = lowerSkill.replace(/[^\w\s+#]/g, ' '); // node js
      
      // Ensure we have something to match
      if (!condensedSkill && !spacedSkill.trim()) return;

      // Escape for regex
      const escCondensed = condensedSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escSpaced = spacedSkill.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Check for either the spaced or condensed version using word boundaries
      // We use a broader check for condensed version if it's substantial
      const regexSpaced = escSpaced ? new RegExp(`\\b${escSpaced}\\b`, 'i') : null;
      const regexCondensed = escCondensed ? new RegExp(`\\b${escCondensed}\\b`, 'i') : null;

      const isMatch = (regexSpaced && regexSpaced.test(spacedText)) || 
                      (regexCondensed && regexCondensed.test(condensedText));

      if (isMatch) {
        matchedSkills.push(skill);
        console.log(`[ATS Parser] Match found: ${skill}`);
      }
    });

    // 4. Calculate final ATS Score (Percentage)
    const atsScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    console.log(`[ATS Parser] Score: ${atsScore}% (${matchedSkills.length}/${requiredSkills.length} matches)`);
    console.log("[ATS Parser] Matched:", matchedSkills);

    return {
      atsScore,
      matchedSkills,
      resumeText: rawText
    };

  } catch (error) {
    console.error('Failed to parse resume:', error);
    // Return empty results instead of crashing the process
    return { atsScore: 0, matchedSkills: [], resumeText: "" };
  }
};
