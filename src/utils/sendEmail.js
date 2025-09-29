import nodemailer from 'nodemailer'
import { google } from 'googleapis';

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const OAUTH2_USER = process.env.OAUTH2_USER

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })


const sendVerificationMail = async (email, OTP) => {

    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: OAUTH2_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken?.token,
            },
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 60000,
        });

        const mailOptions = {
            from: process.env.OAUTH2_MAIL_SENDER,
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
        }

        await transport.sendMail(mailOptions)
        console.log("verification mail sent successfully.")
    } catch (error) {
        console.error(`Error sending verification email to ${email}:`, error);
    }
}


const sendForgotPasswordMail = async (email, OTP, username) => {

    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: OAUTH2_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken?.token,
            },
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 60000,
        });


        const mailOptions = {
            from: process.env.OAUTH2_MAIL_SENDER,
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
        }
        await transport.sendMail(mailOptions)
        console.log("password reset mail sent successfully.")

    } catch (error) {
        console.error(`Error sending password reset email to ${email}:`, error);
    }
}


export {
    sendVerificationMail,
    sendForgotPasswordMail
}