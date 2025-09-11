import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email template for study material delivery
const getEmailTemplate = (userName, materialTitle, downloadLink) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #6c63ff; padding: 20px; text-align: center; color: white;">
      <h1>Your Study Material is Ready!</h1>
    </div>
    <div style="padding: 20px;">
      <p>Hello ${userName},</p>
      <p>Your requested study material <strong>${materialTitle}</strong> is ready for download.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${downloadLink}" 
           style="display: inline-block; padding: 12px 24px; 
                  background-color: #6c63ff; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 5px;
                  font-weight: bold;">
          Download Now
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all;">${downloadLink}</p>
      <p>This link will expire in 7 days.</p>
      <p>Best regards,<br>Smart Study Team</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  </div>
`;

/**
 * Send study material via email
 * @param {string} to - Recipient email
 * @param {string} userName - Recipient's name
 * @param {string} materialTitle - Title of the study material
 * @param {string} filePath - Path to the file to be attached
 * @param {string} [downloadLink] - Optional direct download link
 * @returns {Promise<Object>} Email sending result
 */
export const sendMaterialByEmail = async (to, userName, materialTitle, filePath, downloadLink) => {
  try {
    const mailOptions = {
      from: `"Smart Study" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
      to,
      subject: `Your Study Material: ${materialTitle}`,
      html: getEmailTemplate(userName, materialTitle, downloadLink || '#')
    };

    // If file path is provided, attach the file
    if (filePath && fs.existsSync(filePath)) {
      mailOptions.attachments = [{
        filename: path.basename(filePath),
        path: filePath
      }];
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send email notification with download link
 * @param {string} to - Recipient email
 * @param {string} userName - Recipient's name
 * @param {string} materialTitle - Title of the study material
 * @param {string} downloadLink - Direct download link
 * @returns {Promise<Object>} Email sending result
 */
export const sendDownloadLinkByEmail = async (to, userName, materialTitle, downloadLink) => {
  try {
    const mailOptions = {
      from: `"Smart Study" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
      to,
      subject: `Download Link: ${materialTitle}`,
      html: getEmailTemplate(userName, materialTitle, downloadLink)
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send download link: ${error.message}`);
  }
};

export default {
  sendMaterialByEmail,
  sendDownloadLinkByEmail
};
