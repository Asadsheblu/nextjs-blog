// eslint-disable-next-line react/prop-types
// eslint-disable-next-line no-undef
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, username, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    text: `Hello ${username},\n\nPlease verify your email by verify-email?token=${token}\n\nThank you!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}
