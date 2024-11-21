import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationMail = async (email, OTP) => {
    console.log(OTP)
    try {
        await resend.emails.send({
            from: process.env.RESEND_MAIL_SENDER,
            to: [email],
            subject: 'Verify your Email',
            html: `
            <h1>Email Verification</h1>
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) for email verification is <strong>${OTP}</strong>.</p>
            <p>Please enter this code to verify your email address. This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you!</p>
        `,
        });

        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending verification email to ${email}:`, error);
    }
};


const sendForgotPasswordMail = async (email, OTP, username) => {
    console.log(OTP)
    try {
        await resend.emails.send({
            from: process.env.RESEND_MAIL_SENDER,
            to: [email],
            subject: `Reset your password ${username}`,
            html: `
                <h1>Password Reset</h1>
                <p>Hello ${username},</p>
                <p>Your One-Time Password (OTP) to reset your password is <strong>${OTP}</strong>.</p>
                <p>Please use this code to reset your password. This code will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you!</p>
            `,
        });

        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending password reset email to ${email}:`, error);
    }
};


export {
    sendVerificationMail,
    sendForgotPasswordMail
}