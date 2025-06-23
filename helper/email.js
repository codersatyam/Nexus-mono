const nodemailer = require('nodemailer');
const logger = require('../domain/logs');
const allErrors = require('../domain/errors');
require("dotenv").config();
console.log("till here", process.env.EMAIL_USER)

// In-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create email transporter
const createTransporter = () => {
    const config = {
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    };

    // Add Gmail-specific settings
    if (config.service === 'gmail') {
        config.secure = false;
        config.tls = {
            rejectUnauthorized: false
        };
    }

    // Add custom SMTP settings if provided
    if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
        config.host = process.env.EMAIL_HOST;
        config.port = process.env.EMAIL_PORT;
        config.service = undefined; // Remove service when using custom SMTP
    }

    return nodemailer.createTransport(config);
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER || "crewkraft.org@gmail.com",
            to: email,
            subject: 'Your OTP for Nexus Application',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #333; margin-bottom: 10px;">Nexus Application</h2>
                        <p style="color: #666; margin: 0;">Your One-Time Password (OTP)</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <p style="color: #333; margin-bottom: 10px;"><strong>Important:</strong></p>
                        <ul style="color: #666; margin: 0; padding-left: 20px;">
                            <li>This OTP is valid for 10 minutes only</li>
                            <li>Do not share this OTP with anyone</li>
                            <li>If you didn't request this OTP, please ignore this email</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            This is an automated email. Please do not reply to this message.
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`OTP email sent to ${email}: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error('Error sending OTP email:', error);
        throw error;
    }
};

// Generate and send OTP
const generateAndSendOTP = async (email) => {
    try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return allErrors.invalidField('email', 'Invalid email format').getJSONError();
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP with expiration (10 minutes)
        const expirationTime = Date.now() + (10 * 60 * 1000); // 10 minutes
        otpStorage.set(email, {
            otp: otp,
            expiresAt: expirationTime,
            attempts: 0
        });

        // Send OTP email
        await sendOTPEmail(email, otp);
        

        return {
            status: 'success',
            message: 'OTP sent successfully',
            otp:otp
        };
    } catch (error) {
        logger.error('Error generating and sending OTP:', error);
        return allErrors.unexpectedError.getJSONError();
    }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
    try {
        const storedData = otpStorage.get(email);
        
        if (!storedData) {
            return allErrors.invalidField('otp', 'OTP not found or expired').getJSONError();
        }

        // Check if OTP has expired
        if (Date.now() > storedData.expiresAt) {
            otpStorage.delete(email);
            return allErrors.invalidField('otp', 'OTP has expired').getJSONError();
        }

        // Check if too many attempts
        if (storedData.attempts >= 3) {
            otpStorage.delete(email);
            return allErrors.invalidField('otp', 'Too many failed attempts. Please request a new OTP').getJSONError();
        }

        // Increment attempts
        storedData.attempts++;

        // Verify OTP
        if (storedData.otp === otp) {
            // OTP is correct, remove it from storage
            otpStorage.delete(email);
            return {
                status: 'success',
                message: 'OTP verified successfully',
                data: {
                    email: email,
                    verified: true
                }
            };
        } else {
            // Update attempts in storage
            otpStorage.set(email, storedData);
            return allErrors.invalidField('otp', 'Invalid OTP').getJSONError();
        }
    } catch (error) {
        logger.error('Error verifying OTP:', error);
        return allErrors.unexpectedError.getJSONError();
    }
};

// Resend OTP
const resendOTP = async (email) => {
    try {
        // Remove existing OTP if any
        otpStorage.delete(email);
        
        // Generate and send new OTP
        return await generateAndSendOTP(email);
    } catch (error) {
        logger.error('Error resending OTP:', error);
        return allErrors.unexpectedError.getJSONError();
    }
};

// Get OTP status (for debugging/testing)
const getOTPStatus = (email) => {
    const storedData = otpStorage.get(email);
    if (!storedData) {
        return {
            status: 'not_found',
            message: 'No OTP found for this email'
        };
    }

    const isExpired = Date.now() > storedData.expiresAt;
    const remainingTime = Math.max(0, Math.floor((storedData.expiresAt - Date.now()) / 1000));

    return {
        status: 'found',
        data: {
            email: email,
            isExpired: isExpired,
            remainingTime: `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`,
            attempts: storedData.attempts
        }
    };
};

module.exports = {
    generateAndSendOTP,
    verifyOTP,
    resendOTP,
    getOTPStatus
}; 