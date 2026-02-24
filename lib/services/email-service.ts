import * as nodemailer from "nodemailer";
import { google } from "googleapis";

// OAuth2 configuration (for Gmail if needed in future)
const OAUTH_CONFIG = {
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  user: process.env.SMTP_USER || "sales@kkengineeringpharma.com",
};

// Email configuration - support both SSL (465) and TLS (587)
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: parseInt(process.env.SMTP_PORT || "587") === 465, // true for 465, false for other ports
};

const COMPANY_INFO = {
  name: "KK Engineeringceuticals",
  email: "sales@kkengineeringpharma.com",
  adminEmail: "sales@kkengineeringpharma.com",
  ccEmail: "sudheer@sjmedialabs.com",
  phone: "+91 9963274091",
  website: "https://kkengineeringpharma.com",
};

// Create OAuth2 client and get access token
async function getOAuth2AccessToken() {
  const oauth2Client = new google.auth.OAuth2(
    OAUTH_CONFIG.clientId,
    OAUTH_CONFIG.clientSecret,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: OAUTH_CONFIG.refreshToken,
  });

  try {
    const accessToken = await oauth2Client.getAccessToken();
    return accessToken.token;
  } catch (error) {
    console.error("Failed to get OAuth2 access token:", error);
    throw error;
  }
}

// Create reusable transporter object with OAuth2 or fallback to app password
const createTransport = async () => {
  // Try OAuth2 first (for Gmail only)
  if (
    OAUTH_CONFIG.clientId &&
    OAUTH_CONFIG.clientSecret &&
    OAUTH_CONFIG.refreshToken &&
    OAUTH_CONFIG.user
  ) {
    try {
      const accessToken = await getOAuth2AccessToken();

      const transporter = nodemailer.createTransport({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: SMTP_CONFIG.secure,
        auth: {
          type: "OAuth2",
          user: OAUTH_CONFIG.user,
          clientId: OAUTH_CONFIG.clientId,
          clientSecret: OAUTH_CONFIG.clientSecret,
          refreshToken: OAUTH_CONFIG.refreshToken,
          accessToken: accessToken,
        },
      });

      console.log("✅ Email service configured with OAuth2");
      return transporter;
    } catch (error) {
      console.error("❌ Failed to create OAuth2 transporter:", error);
      console.log("⚠️  Falling back to password authentication...");
    }
  }

  // Fallback to standard password authentication (works for GoDaddy, Gmail, Outlook)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: SMTP_CONFIG.secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      console.log(
        `✅ Email service configured (${SMTP_CONFIG.host}:${SMTP_CONFIG.port}, secure: ${SMTP_CONFIG.secure})`,
      );
      return transporter;
    } catch (error) {
      console.error("Failed to create email transporter with password:", error);
      return null;
    }
  }

  console.warn("❌ SMTP credentials not configured. Email service disabled.");
  return null;
};

export const sendEnquiryAutoReply = async (enquiry: {
  email: string;
  name: string;
  type: string;
  productName?: string;
  casNumber?: string;
  message?: string;
}) => {
  const transporter = await createTransport();
  if (!transporter) {
    console.log("Email service not configured, skipping auto-reply");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const subject = getSubjectByType(enquiry.type);
    const htmlContent = generateEmailTemplate(enquiry);

    const mailOptions = {
      from: `"${COMPANY_INFO.name}" <${COMPANY_INFO.email}>`,
      to: enquiry.email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Auto-reply email sent:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Failed to send auto-reply email:", error);
    return { success: false, error: error.message };
  }
};

const getSubjectByType = (type: string): string => {
  switch (type) {
    case "product":
      return `Thank You for Your API Enquiry - ${COMPANY_INFO.name}`;
    case "general_product":
      return `Thank You for Your Product Enquiry - ${COMPANY_INFO.name}`;
    case "general":
      return `Thank You for Contacting ${COMPANY_INFO.name}`;
    default:
      return `Thank You for Your Enquiry - ${COMPANY_INFO.name}`;
  }
};

const generateEmailTemplate = (enquiry: {
  name: string;
  type: string;
  productName?: string;
  casNumber?: string;
  message?: string;
}): string => {
  const { name, type, productName, casNumber, message } = enquiry;

  const getEnquiryTypeText = () => {
    switch (type) {
      case "product":
        return "API (Active Pharmaceutical Ingredient) Enquiry";
      case "general_product":
        return "Product Enquiry";
      case "general":
        return "General Enquiry";
      default:
        return "Enquiry";
    }
  };

  const getEnquirySpecificContent = () => {
    if (type === "product" || type === "general_product") {
      return `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">Enquiry Details:</h3>
          ${productName ? `<p style="margin: 5px 0;"><strong>Product Name:</strong> ${productName}</p>` : ""}
          ${casNumber ? `<p style="margin: 5px 0;"><strong>CAS Number:</strong> ${casNumber}</p>` : ""}
          ${message ? `<p style="margin: 5px 0;"><strong>Your Message:</strong></p><p style="margin: 5px 0; font-style: italic;">"${message}"</p>` : ""}
        </div>
      `;
    }
    return message
      ? `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">Your Message:</h3>
        <p style="margin: 0; font-style: italic;">"${message}"</p>
      </div>
    `
      : "";
  };

  const getNextStepsContent = () => {
    switch (type) {
      case "product":
        return `
          <h3 style="color: #2563eb; margin: 20px 0 10px 0;">What Happens Next?</h3>
          <ul style="color: #4b5563; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Our pharmaceutical experts will review your API requirements</li>
            <li>We'll verify product specifications and availability</li>
            <li>You'll receive a detailed quotation with pricing and delivery timelines</li>
            <li>Our team will assist you with regulatory and documentation requirements</li>
          </ul>
        `;
      case "general_product":
        return `
          <h3 style="color: #2563eb; margin: 20px 0 10px 0;">What Happens Next?</h3>
          <ul style="color: #4b5563; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Our product specialists will review your enquiry</li>
            <li>We'll provide detailed product information and specifications</li>
            <li>You'll receive pricing and availability information</li>
            <li>Our team will guide you through the ordering process</li>
          </ul>
        `;
      default:
        return `
          <h3 style="color: #2563eb; margin: 20px 0 10px 0;">What Happens Next?</h3>
          <ul style="color: #4b5563; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Our team will carefully review your enquiry</li>
            <li>A specialist will contact you within 24 hours</li>
            <li>We'll provide you with the information and assistance you need</li>
          </ul>
        `;
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Thank You for Your Enquiry</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kk-engineering-LOGO-original-wWP2iaSaGxp7DpW3TLlb0sTnTqTdst.png" 
             alt="${COMPANY_INFO.name}" 
             style="max-height: 60px; width: auto;">
      </div>

      <!-- Main Content -->
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <h1 style="color: #2563eb; margin: 0 0 20px 0; font-size: 24px;">Thank You, ${name}!</h1>
        
        <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 16px;">
          We have successfully received your <strong>${getEnquiryTypeText()}</strong> and truly appreciate you choosing ${COMPANY_INFO.name} for your pharmaceutical needs.
        </p>

        ${getEnquirySpecificContent()}

        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <p style="margin: 0; color: #1e3a8a; font-weight: 500;">
            🕒 <strong>Response Time:</strong> Our specialized team will contact you within 24 hours during business days.
          </p>
        </div>

        ${getNextStepsContent()}

        <div style="margin: 25px 0; padding: 20px; background-color: #fafafa; border-radius: 8px;">
          <h3 style="color: #2563eb; margin: 0 0 15px 0;">Need Immediate Assistance?</h3>
          <p style="margin: 0 0 10px 0; color: #4b5563;">Feel free to reach out to us directly:</p>
          <p style="margin: 5px 0; color: #4b5563;">📧 Email: <a href="mailto:${COMPANY_INFO.adminEmail}" style="color: #2563eb;">${COMPANY_INFO.adminEmail}</a></p>
          <p style="margin: 5px 0; color: #4b5563;">📱 Phone: <a href="tel:${COMPANY_INFO.phone}" style="color: #2563eb;">${COMPANY_INFO.phone}</a></p>
          <p style="margin: 5px 0; color: #4b5563;">🌐 Website: <a href="${COMPANY_INFO.website}" style="color: #2563eb;">${COMPANY_INFO.website}</a></p>
        </div>

        <div style="margin: 25px 0; text-align: center; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 8px;">
          <p style="margin: 0; color: white; font-weight: 500;">
            Quality Pharmaceuticals • Trusted Partnership • Global Reach
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px;">
        <p style="margin: 0 0 10px 0;">This is an automated confirmation email from ${COMPANY_INFO.name}</p>
        <p style="margin: 0;">© ${new Date().getFullYear()} ${COMPANY_INFO.name}. All rights reserved.</p>
      </div>

    </body>
    </html>
  `;
};

// Send notification to admin about new enquiry
export const sendAdminNotification = async (enquiry: {
  email: string;
  name: string;
  type: string;
  productName?: string;
  casNumber?: string;
  message?: string;
  phone?: string;
  company?: string;
}) => {
  const transporter = await createTransport();
  if (!transporter) {
    console.log("Email service not configured, skipping admin notification");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const subject = `New ${enquiry.type.replace("_", " ").toUpperCase()} Enquiry from ${enquiry.name}`;
    const htmlContent = generateAdminNotificationTemplate(enquiry);

    const mailOptions = {
      from: `"${COMPANY_INFO.name} System" <${COMPANY_INFO.email}>`,
      to: COMPANY_INFO.adminEmail,
      cc: COMPANY_INFO.ccEmail,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `✅ Admin notification email sent to: ${COMPANY_INFO.adminEmail}, cc: ${COMPANY_INFO.ccEmail}, messageId: ${info.messageId}`,
    );

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Failed to send admin notification email:", error);
    return { success: false, error: error.message };
  }
};

const generateAdminNotificationTemplate = (enquiry: {
  email: string;
  name: string;
  type: string;
  productName?: string;
  casNumber?: string;
  message?: string;
  phone?: string;
  company?: string;
}): string => {
  const { name, email, phone, company, type, productName, casNumber, message } =
    enquiry;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Enquiry Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #dc2626; margin: 0;">🔔 New Enquiry Received</h1>
        <p style="margin: 5px 0 0 0; color: #6b7280;">Type: <strong>${type.replace("_", " ").toUpperCase()}</strong> | Received: ${new Date().toLocaleString()}</p>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        
        <h2 style="color: #1f2937; margin: 0 0 15px 0;">Customer Information</h2>
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ""}
          ${company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>` : ""}
        </div>

        ${
          productName || casNumber
            ? `
          <h3 style="color: #1f2937; margin: 20px 0 10px 0;">Product Details</h3>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            ${productName ? `<p style="margin: 5px 0;"><strong>Product Name:</strong> ${productName}</p>` : ""}
            ${casNumber ? `<p style="margin: 5px 0;"><strong>CAS Number:</strong> ${casNumber}</p>` : ""}
          </div>
        `
            : ""
        }

        ${
          message
            ? `
          <h3 style="color: #1f2937; margin: 20px 0 10px 0;">Message</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        `
            : ""
        }

        <div style="margin-top: 25px; padding: 15px; background-color: #fef3c7; border-radius: 5px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;">
            <strong>⚡ Action Required:</strong> Please respond to this enquiry within 24 hours to maintain our service standards.
          </p>
        </div>

      </div>

      <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>This notification was generated automatically by ${COMPANY_INFO.name} enquiry system.</p>
      </div>

    </body>
    </html>
  `;
};
