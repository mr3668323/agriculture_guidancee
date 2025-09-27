// backend/src/controllers/authController.js

import User from '../../models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


dotenv.config({ path: '../../../.env' });

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user instance
        user = new User({
            username,
            email,
            password, // Password will be hashed by pre-save hook in User model
        });

        // Save user to database
        await user.save();

        // Generate JWT Token
        const payload = {
            user: {
                id: user.id,
                username: user.username, // Include username in payload
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    msg: 'User registered successfully',
                    token,
                    user: { id: user.id, username: user.username, email: user.email } // Return user data for frontend
                });
            }
        );

    } catch (err) {
        console.error('Signup error:', err.message);
        // === MODIFIED LINE HERE ===
        res.status(500).json({ msg: 'Server error during signup' }); // Always send JSON
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[Auth] Signin attempt for email: ${email}`);

    try {
        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            console.warn(`[Auth] No user found for email: ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        console.log(`[Auth] User found: ${user.username} (${user.id})`);

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn(`[Auth] Wrong password for email: ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        console.log(`[Auth] Password verified for email: ${email}`);

        // 3. Generate JWT Token
        if (!process.env.JWT_SECRET) {
            console.error('❌ JWT_SECRET not defined');
            return res.status(500).json({ msg: 'Server misconfiguration' });
        }

        const payload = { user: { id: user.id, username: user.username } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('[Auth] JWT Sign error:', err.message);
                return res.status(500).json({ msg: 'Token generation failed' });
            }
            console.log(`[Auth] Token generated for user ${user.username}`);
            res.json({
                msg: 'Logged in successfully',
                token,
                user: { id: user.id, username: user.username, email: user.email },
            });
        });

    } catch (err) {
        console.error('[Auth] Signin exception:', err);
        res.status(500).json({ msg: 'Server error during signin' });
    }
};


// authRoutes.js remains unchanged.