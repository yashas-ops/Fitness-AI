import nodemailer from 'nodemailer';
import config from '../config/env.js';

/**
 * Create Nodemailer transporter using Gmail SMTP
 * Throws if SMTP credentials are not configured.
 */
const createTransporter = () => {
  if (!config.smtpUser || !config.smtpPass) {
    console.error('SMTP credentials not configured. Email sending is disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send password reset email with branded HTML template
 */
export async function sendResetPasswordEmail(email, resetUrl) {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('Email service is not configured. Please set SMTP_USER and SMTP_PASS environment variables.');
  }

  // Verify transporter connection before sending
  try {
    await transporter.verify();
  } catch (verifyError) {
    console.error('SMTP connection verification failed:', verifyError);
    throw new Error(`Email server connection failed: ${verifyError.message}`);
  }

  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;padding:0 20px;">
    <!-- Header -->
    <div style="text-align:center;padding:40px 0 24px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#0090b8);padding:14px;border-radius:16px;">
        <span style="font-size:24px;color:#fff;font-weight:bold;">⚡</span>
      </div>
      <h1 style="color:#e8e8ec;margin:16px 0 0;font-size:24px;letter-spacing:-0.02em;">FitnessAI</h1>
    </div>
    
    <!-- Card -->
    <div style="background:rgba(17,17,24,0.9);border:1px solid rgba(0,212,255,0.1);border-radius:20px;padding:40px 32px;text-align:center;">
      <h2 style="color:#e8e8ec;font-size:22px;margin:0 0 12px;letter-spacing:-0.01em;">Reset Your Password</h2>
      <p style="color:#9d9db8;font-size:15px;line-height:1.6;margin:0 0 32px;">
        We received a request to reset your password. Click the button below to create a new password. This link expires in <strong style="color:#00d4ff;">15 minutes</strong>.
      </p>
      
      <!-- Button -->
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#0090b8);color:#fff;font-weight:600;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;box-shadow:0 8px 32px rgba(0,212,255,0.2);">
        Reset Password
      </a>
      
      <!-- Fallback link -->
      <p style="color:#5e5e7e;font-size:12px;margin:24px 0 0;line-height:1.6;">
        If the button doesn't work, copy this link:<br>
        <a href="${resetUrl}" style="color:#00d4ff;word-break:break-all;text-decoration:none;">${resetUrl}</a>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;">
      <p style="color:#5e5e7e;font-size:12px;margin:0;">
        If you didn't request this, you can safely ignore this email.<br>
        © ${new Date().getFullYear()} FitnessAI
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"FitnessAI" <${config.smtpUser}>`,
    to: email,
    subject: '🔐 Reset Your FitnessAI Password',
    html: htmlTemplate,
    text: `Reset your FitnessAI password by visiting: ${resetUrl}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, ignore this email.`
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Reset email sent successfully' };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
