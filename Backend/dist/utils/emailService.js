"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEvaluationReport = exports.sendInterviewReminder = exports.sendInterviewInvitation = exports.sendCandidateEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const OAuth2 = googleapis_1.google.auth.OAuth2;
const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID?.trim(), process.env.GOOGLE_CLIENT_SECRET?.trim(), process.env.GOOGLE_REDIRECT_URI?.trim());
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();
console.log(`[EmailService] 🔍 Initializing with token starting with: ${refreshToken?.substring(0, 5)}...`);
oauth2Client.setCredentials({ refresh_token: refreshToken });
const getTransporter = async () => {
    try {
        const { token } = await oauth2Client.getAccessToken();
        if (!token)
            throw new Error("[EmailService] ❌ Failed to acquire OAuth2 Access Token.");
        return nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "mishalkvmishal@gmail.com",
                clientId: process.env.GOOGLE_CLIENT_ID?.trim(),
                clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim(),
                refreshToken: refreshToken,
                accessToken: token,
            },
        });
    }
    catch (err) {
        console.error("[EmailService] ❌ OAuth2 Error Details:", err.response?.data || err.message);
        throw err;
    }
};
/**
 * Professional Email Service for HireSphere
 * Leverages Gmail OAuth2 for reliable delivery
 */
const sendCandidateEmail = async (to, subject, message, candidateName, companyName = "HireSphere Recruitment", actionUrl) => {
    try {
        const transporter = await getTransporter();
        const htmlContent = `
      <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background: #ffffff;">
        <div style="background: #064e3b; padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">HireSphere</h1>
          <p style="color: #d1fae5; margin-top: 8px; font-weight: 600; opacity: 0.8;">Recruitment Portal Notification</p>
        </div>
        
        <div style="padding: 40px; line-height: 1.6; border: 1px solid #f1f5f9; border-top: none; border-bottom: none;">
          <p style="font-size: 16px; margin-bottom: 24px;">Dear <strong>${candidateName}</strong>,</p>
          <div style="background: #f8fafc; padding: 24px; border-radius: 8px; border-left: 4px solid #064e3b; font-style: italic; color: #475569; margin-bottom: 24px;">
            "${message}"
          </div>

          ${actionUrl ? `
            <div style="text-align: center; margin: 40px 0;">
                <a href="${actionUrl}" style="background-color: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);">
                    View & Sign Offer Letter
                </a>
                <p style="font-size: 11px; color: #94a3b8; margin-top: 12px;">This document is legally binding when signed.</p>
            </div>
          ` : ''}

          <p style="font-size: 14px; color: #64748b; margin-top: 32px;">
            Best regards,<br>
            <strong>The Recruitment Team</strong><br>
            ${companyName}
          </p>
        </div>
        
        <div style="background: #f1f5f9; padding: 32px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">This email was sent via HireSphere Management Suite.</p>
          <p style="margin-top: 8px;">&copy; 2026 ${companyName}. All rights reserved.</p>
        </div>
      </div>
    `;
        const mailOptions = {
            from: `"${companyName}" <mishalkvmishal@gmail.com>`,
            to,
            subject,
            html: htmlContent,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Professional email sent to ${to}: ${result.messageId}`);
        return result;
    }
    catch (error) {
        console.error("[EmailService] Critical failure sending email:", error);
        throw error;
    }
};
exports.sendCandidateEmail = sendCandidateEmail;
/**
 * Sends a high-fidelity interview invitation
 */
const sendInterviewInvitation = async (to, recipientName, interviewDate, startTime, endTime, meetingLink, otherPartyName, type = 'candidate', companyName = "HireSphere Recruitment") => {
    try {
        const isInterviewer = type === 'interviewer';
        // Dynamic Content based on User Role
        const emailSubject = isInterviewer
            ? `Action Required: New Interview Assigned - ${recipientName}`
            : `Interview Invitation: ${recipientName} x ${companyName}`;
        const badgeText = isInterviewer ? "Evaluation Assignment" : "Internal Interview Invitation";
        const welcomeMessage = isInterviewer
            ? `You have been assigned as the primary evaluator for an upcoming logic session with <strong>${otherPartyName}</strong>.`
            : `Great news! We've reviewed your application and would like to invite you for a professional evaluation with our logic team.`;
        const instructions = isInterviewer
            ? `Please ensure you have reviewed the candidate's profile and resume in the HireSphere portal before the session starts.`
            : `Please ensure you are in a quiet environment with a stable internet connection for the duration of the session.`;
        const transporter = await getTransporter();
        const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: #064e3b; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">HireSphere</h1>
            <p style="color: #d1fae5; margin-top: 8px; font-size: 14px; font-weight: 500; text-transform: uppercase; opacity: 0.8;">${badgeText}</p>
          </div>

          <!-- Content Section -->
          <div style="padding: 40px; background: #ffffff;">
            <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin-bottom: 24px;">Hi ${recipientName},</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">${welcomeMessage}</p>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 32px; font-style: italic;">${instructions}</p>
            
            <!-- Details Card -->
            <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding-bottom: 12px; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Date</td>
                  <td style="padding-bottom: 12px; color: #1e293b; font-size: 15px; font-weight: 600; text-align: right;">${interviewDate}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Time Slot</td>
                  <td style="padding-bottom: 12px; color: #1e293b; font-size: 15px; font-weight: 600; text-align: right;">${startTime} - ${endTime}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">${isInterviewer ? 'Candidate' : 'Interviewer'}</td>
                  <td style="color: #1e293b; font-size: 15px; font-weight: 600; text-align: right;">${otherPartyName}</td>
                </tr>
              </table>
            </div>

          </div>

          <!-- Action Area -->
          <div style="text-align: center;">
            <a href="${meetingLink}" style="display: inline-block; background: #064e3b; color: #ffffff; padding: 16px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(6, 78, 59, 0.3);">
              ${isInterviewer ? 'Open Interview Room' : 'Join Interview Meeting'}
            </a>
            <p style="margin-top: 16px; font-size: 13px; color: #94a3b8;">Meeting Link: ${meetingLink}</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 32px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #64748b; font-size: 13px; margin: 0;">Sent via HireSphere Recruitment Suite by ${companyName}.</p>
          <p style="color: #94a3b8; font-size: 11px; margin-top: 8px;">&copy; 2026 HireSphere. All rights reserved.</p>
        </div>
      </div>
    </div>
    `;
        const mailOptions = {
            from: `"${companyName}" <mishalkvmishal@gmail.com>`,
            to,
            subject: emailSubject,
            html: htmlContent,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Invitation sent to ${to}: ${result.messageId}`);
        return result;
    }
    catch (error) {
        console.error("[EmailService] Invitation failed:", error);
        throw error;
    }
};
exports.sendInterviewInvitation = sendInterviewInvitation;
/**
 * Sends a professional interview reminder
 */
const sendInterviewReminder = async (to, candidateName, interviewDate, startTime, meetingLink, role, companyName = "HireSphere Recruitment") => {
    try {
        const transporter = await getTransporter();
        const isCandidate = role === 'candidate';
        const title = isCandidate ? "See you tomorrow!" : "Upcoming Interview Reminder";
        const subTitle = isCandidate ? "Internal Interview Reminder" : "Platform Management Notification";
        const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #fffcf9; padding: 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fed7aa; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: #7c2d12; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">HireSphere</h1>
            <p style="color: #ffedd5; margin-top: 8px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8;">${subTitle}</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px;">
            <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin-bottom: 16px;">${title}</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
              ${isCandidate
            ? `Hi ${candidateName}, this is a friendly reminder that your interview logic session is scheduled for tomorrow. We're looking forward to meeting you!`
            : `Hi, this is a reminder that you have an upcoming interview session with ${candidateName} in the next 24 hours.`}
            </p>
            
            <!-- Details Card -->
            <div style="background: #fff7ed; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #ffedd5;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #9a3412; font-size: 13px; font-weight: 700; text-transform: uppercase;">Session ID</td>
                  <td style="color: #1e293b; font-size: 15px; font-weight: 600; text-align: right;">HS-REC-${Math.floor(Math.random() * 10000)}</td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; color: #9a3412; font-size: 13px; font-weight: 700; text-transform: uppercase;">Time</td>
                  <td style="padding-top: 12px; color: #7c2d12; font-size: 15px; font-weight: 700; text-align: right;">${startTime} (${interviewDate})</td>
                </tr>
              </table>
            </div>

            <!-- Action Area -->
            <div style="text-align: center;">
              <a href="${meetingLink}" style="display: inline-block; background: #7c2d12; color: #ffffff; padding: 16px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 16px;">Prepare for Session</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #fffcf9; padding: 32px; border-top: 1px solid #ffedd5; text-align: center;">
            <p style="color: #9a3412; font-size: 11px; margin: 0; font-weight: 600;">DO NOT REPLY TO THIS SYSTEM NOTIFICATION</p>
            <p style="color: #94a3b8; font-size: 11px; margin-top: 8px;">&copy; 2026 HireSphere Suite. Confidential Recruitment Property.</p>
          </div>
        </div>
      </div>
    `;
        const mailOptions = {
            from: `"HireSphere Reminders" <mishalkvmishal@gmail.com>`,
            to,
            subject: `Reminder: Your Interview Session starts soon!`,
            html: htmlContent,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Reminder sent to ${to}: ${result.messageId}`);
        return result;
    }
    catch (error) {
        console.error("[EmailService] Reminder failed:", error);
        throw error;
    }
};
exports.sendInterviewReminder = sendInterviewReminder;
/**
 * Sends a detailed Evaluation Report to the Hiring Manager (Admin)
 */
const sendEvaluationReport = async (to, candidateName, interviewerName, score, comments, companyName = "HireSphere Recruitment") => {
    try {
        const transporter = await getTransporter();
        const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #fdfdfd; padding: 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e1e4e8; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: #111827; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">HireSphere</h1>
            <p style="color: #9ca3af; margin-top: 8px; font-size: 14px; font-weight: 500; text-transform: uppercase;">Evaluation Report Sync</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px;">
            <h2 style="color: #111827; font-size: 20px; font-weight: 800; margin-bottom: 24px;">Evaluation for ${candidateName} Completed</h2>
            
            <!-- Summary Grid -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #f3f4f6;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Evaluation Score</p>
              <p style="margin: 0; color: #111827; font-size: 32px; font-weight: 800;">${score}<span style="font-size: 16px; font-weight: 400; color: #9ca3af;"> / 5.0</span></p>
              <p style="margin-top: 16px; margin-bottom: 0; color: #6b7280; font-size: 14px;"><strong>Interviewer:</strong> ${interviewerName}</p>
            </div>

            <!-- Notes Section -->
            <div style="margin-bottom: 32px;">
              <p style="color: #111827; font-size: 16px; font-weight: 700; margin-bottom: 12px;">Notes & Comments:</p>
              <div style="background: #ffffff; border: 1px solid #f3f4f6; padding: 20px; border-radius: 8px; font-style: italic; color: #4b5563; font-size: 14px; line-height: 1.6;">
                "${comments || 'No comments provided by the interviewer.'}"
              </div>
            </div>

            <!-- Action Area -->
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/candidates" style="display: inline-block; background: #111827; color: #ffffff; padding: 16px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">Review All Candidates</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 32px; border-top: 1px solid #f3f4f6; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">Automated Recruiter Report by ${companyName}.</p>
            <p style="color: #9ca3af; font-size: 10px; margin-top: 8px;">&copy; 2026 HireSphere Management Suite.</p>
          </div>
        </div>
      </div>
    `;
        const mailOptions = {
            from: `"HireSphere Evaluation Engine" <mishalkvmishal@gmail.com>`,
            to,
            subject: `Evaluation Sync: ${candidateName} (Score: ${score}/5.0)`,
            html: htmlContent,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Evaluation Report sent to Admin: ${result.messageId}`);
        return result;
    }
    catch (error) {
        console.error("[EmailService] Evaluation Report failed:", error);
        throw error;
    }
};
exports.sendEvaluationReport = sendEvaluationReport;
