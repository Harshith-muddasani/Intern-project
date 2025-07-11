import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailConfiguration() {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration missing!');
    console.error('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    return;
  }

  try {
    // Test Gmail configuration
    console.log('\nTesting Gmail configuration...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail configuration successful!');

    // Test sending email
    console.log('\nTesting email sending...');
    const testEmail = {
      from: `"MiAltar Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'MiAltar Email Test',
      text: 'This is a test email from MiAltar to verify email configuration.',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #f97316;">MiAltar Email Test</h2>
          <p>This is a test email to verify that your email configuration is working correctly.</p>
          <p>If you received this email, your email reset functionality should work properly.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Check your inbox for the test email.');

  } catch (error) {
    console.error('❌ Email configuration failed:', error.message);
    
    // Try SMTP fallback
    console.log('\nTrying SMTP fallback configuration...');
    try {
      const smtpTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      await smtpTransporter.verify();
      console.log('✅ SMTP fallback configuration successful!');
      
      // Test sending with SMTP
      const testEmail = {
        from: `"MiAltar Test" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'MiAltar Email Test (SMTP)',
        text: 'This is a test email using SMTP configuration.',
      };

      const info = await smtpTransporter.sendMail(testEmail);
      console.log('✅ SMTP test email sent successfully!');
      console.log('Message ID:', info.messageId);
      
    } catch (smtpError) {
      console.error('❌ SMTP configuration also failed:', smtpError.message);
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure you have 2FA enabled on your Gmail account');
      console.log('2. Generate an App Password for this application');
      console.log('3. Use the App Password as EMAIL_PASS (not your regular password)');
      console.log('4. Check the EMAIL_SETUP_GUIDE.md for detailed instructions');
    }
  }
}

// Run the test
testEmailConfiguration().catch(console.error); 