const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async (toEmail, resetLink, userName) => {
  const { data, error } = await resend.emails.send({
    from: 'SecureApp <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Password Reset Request - SecureApp',
    html: `<p>Hello ${userName},</p>
           <p>Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset My Password</a>
           <p>This link expires in 60 minutes.</p>`
  });

  if (error) throw new Error(error.message);
  console.log('Reset email sent:', data);
  return data;
};

module.exports = { sendResetEmail };