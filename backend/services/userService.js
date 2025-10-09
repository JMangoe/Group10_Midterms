const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const registerUser = async (username, password, role = 'user') => {
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return {
                success: false,
                message: 'Username already exists'
            };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();

        return {
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role
            }
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error registering user',
            error: error.message
        };
    }
};

const authenticateUser = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }

        const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
        {
            expiresIn: '24h'
        }
        );

        return {
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error authenticating user',
            error: error.message
        };
    }
};

module.exports = {
    registerUser,
    authenticateUser
};