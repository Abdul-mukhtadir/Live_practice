const nodemailer = require('nodemailer');

const sendResetEmail = async (toEmail, resetLink, userName) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SecureApp Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request - SecureApp',
    html: `<p>Hello ${userName},</p>
           <p>Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset My Password</a>
           <p>This link expires in 60 minutes.</p>`
  });

  console.log('Reset email sent to:', toEmail);
};

module.exports = { sendResetEmail };