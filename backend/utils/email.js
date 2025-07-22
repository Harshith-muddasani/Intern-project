import nodemailer from 'nodemailer';

console.log('SMTP DEBUG:', process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@mialtar.com',
    to,
    subject,
    html,
  });
}

// Welcome Email
export async function sendWelcomeEmail(to, name) {
  const html = `<h1>Welcome to MiAltar, ${name}!</h1><p>Thank you for registering.</p>`;
  return sendEmail({ to, subject: 'Welcome to MiAltar!', html });
}

// Password Reset Email
export async function sendPasswordResetEmail(to, resetLink) {
  const html = `<h1>Password Reset</h1><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
  return sendEmail({ to, subject: 'Reset Your Password', html });
}

// Altar Activity Alert
export async function sendAltarActivityAlert(to, activity) {
  const html = `<h1>Altar Activity Alert</h1><p>${activity}</p>`;
  return sendEmail({ to, subject: 'Altar Activity Notification', html });
}

// Newsletter
export async function sendNewsletter(to, subject, content) {
  const html = `<h1>${subject}</h1>${content}`;
  return sendEmail({ to, subject, html });
} 