const nodemailer = require('nodemailer');
const https = require('https');

const sendResetEmail = async (toEmail, resetLink, userName) => {
  const data = JSON.stringify({
    sender: { name: 'SecureApp', email: 'abdulguvi204@gmail.com' },
    to: [{ email: toEmail }],
    subject: 'Password Reset Request - SecureApp',
    htmlContent: `<p>Hello ${userName},</p>
                  <p>Click the link below to reset your password:</p>
                  <a href="${resetLink}">Reset My Password</a>
                  <p>This link expires in 60 minutes.</p>`
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('Email sent:', body);
        resolve(body);
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

module.exports = { sendResetEmail };