import puppeteer from 'puppeteer';
import handlebars from 'handlebars';

export const generateOfferPDF = async (data: {
    candidateName: string;
    jobTitle: string;
    salary: number;
    startDate: string;
    adminName: string;
    companyName: string;
}) => {
    const templateHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            
            body { 
                font-family: 'Inter', sans-serif; 
                margin: 0; 
                padding: 0; 
                color: #334155;
                background-color: white;
            }
            .page {
                padding: 80px 60px;
                position: relative;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 4px solid #f1f5f9;
                padding-bottom: 30px;
                margin-bottom: 50px;
            }
            .brand {
                font-size: 28px;
                font-weight: 800;
                color: #059669;
                letter-spacing: -1px;
            }
            .date-ref {
                text-align: right;
                font-size: 14px;
                color: #64748b;
            }
            .content {
                max-width: 650px;
            }
            h1 {
                font-size: 36px;
                font-weight: 800;
                color: #0f172a;
                margin: 0 0 10px 0;
                letter-spacing: -1px;
            }
            .subtitle {
                font-size: 18px;
                color: #059669;
                font-weight: 600;
                margin-bottom: 40px;
            }
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 20px;
            }
            p {
                font-size: 15px;
                line-height: 1.7;
                margin-bottom: 20px;
                color: #475569;
            }
            .details-card {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                padding: 30px;
                margin: 40px 0;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 25px;
            }
            .detail-item {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .detail-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 700;
                color: #94a3b8;
            }
            .detail-value {
                font-size: 16px;
                font-weight: 700;
                color: #1e293b;
            }
            .footer-signatures {
                margin-top: 80px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 60px;
            }
            .sig-line {
                border-top: 1px solid #cbd5e1;
                padding-top: 15px;
                margin-top: 60px;
            }
            .sig-label {
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
            }
            .company-color { color: #059669; }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="header">
                <div class="brand">HIRESPHERE<span style="color: #64748b">.</span></div>
                <div class="date-ref">
                    Ref: HS-{{currentYear}}-OFFR<br>
                    Date: {{currentDate}}
                </div>
            </div>

            <div class="content">
                <h1>Employment Offer</h1>
                <div class="subtitle">Join our mission at {{companyName}}</div>

                <div class="greeting">Dear {{candidateName}},</div>
                
                <p>
                    Following our recent interview process, we are absolutely thrilled to offer you the position of 
                    <span style="color: #0f172a; font-weight: 700;">{{jobTitle}}</span> at 
                    <span class="company-color" style="font-weight: 700">{{companyName}}</span>.
                </p>

                <p>
                    Your technical expertise and cultural alignment significantly stood out during our evaluation. 
                    We believe your contribution will be instrumental in the continued growth and success of {{companyName}}.
                </p>

                <div class="details-card">
                    <div class="detail-item">
                        <div class="detail-label">Position</div>
                        <div class="detail-value">{{jobTitle}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Annual Salary (CTC)</div>
                        <div class="detail-value">$ {{salary}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Joining Date</div>
                        <div class="detail-value">{{startDate}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Location</div>
                        <div class="detail-value">Remote / HQ</div>
                    </div>
                </div>

                <p>
                    Please review the terms and conditions outlined in the accompanying contract. 
                    This offer is contingent upon successful verification of your professional background.
                </p>

                <div class="footer-signatures">
                    <div>
                        <div class="sig-line"></div>
                        <div class="sig-label">Authorized Signatory, {{companyName}}</div>
                        <div style="font-size: 12px; margin-top: 4px; color: #94a3b8;">{{adminName}}</div>
                    </div>
                    <div>
                        <div class="sig-line"></div>
                        <div class="sig-label">Candidate Signature</div>
                        <div style="font-size: 12px; margin-top: 4px; color: #94a3b8;">{{candidateName}}</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    const compiledTemplate = handlebars.compile(templateHTML);
    const html = compiledTemplate({
        ...data,
        currentDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        currentYear: new Date().getFullYear(),
        salary: data.salary.toLocaleString()
    });

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    await browser.close();
    return pdfBuffer;
};
