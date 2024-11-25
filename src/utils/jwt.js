import jwt from 'jsonwebtoken'; // Import JWT library
import { ApiError } from '../utils/ApiError.js';

const secretKey = process.env.JWT_SECRET // Use a secret key for signing the JWTs

// function to generate JWT
function generateToken(data) {
    return jwt.sign({ data }, secretKey, { algorithm: 'HS256', expiresIn: '20m' }); // Token expires in 20 minutes
}

// function to verify JWT
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey, { algorithms: ['HS256'] }); // Verify token using the secret key
    } catch (err) {
        throw new ApiError(400, err.message || 'Invalid or expired token');
    }
}

export {
    generateToken,
    verifyToken
}