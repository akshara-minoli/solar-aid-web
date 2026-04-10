import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

// Create a transporter using SMTP
// User will need to provide actual SMTP credentials in .env
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: emailUser, // your email
        pass: emailPass, // your email password or app password
    },
});

/**
 * Send an email
 * @param {Object} options - Email options (to, subject, text, html)
 */
export const sendEmail = async (options) => {
    try {
        if (!emailUser || !emailPass) {
            console.warn('⚠️ Email credentials missing in .env. Skipping email send.');
            return;
        }

        const mailOptions = {
            from: `"Solar Aid" <${emailUser}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};

/**
 * Send contact form email to Admin
 */
export const sendContactFormEmail = async (contactData) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || emailUser;

        if (!adminEmail) {
            console.warn('⚠️ Admin email not defined. Skipping contact notification.');
            return;
        }

        await sendEmail({
            to: adminEmail,
            subject: `New Contact Form Submission: ${contactData.name}`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; margin-top: 10px;">
            ${contactData.message}
          </div>
          <hr style="margin-top: 20px;">
          <p style="font-size: 12px; color: #7f8c8d;">This email was sent from the Solar Aid Contact Form.</p>
        </div>
      `,
        });
    } catch (error) {
        console.error('❌ Error sending contact form email:', error.message);
    }
};
