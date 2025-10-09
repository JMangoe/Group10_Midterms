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

module.exports = {
    registerUser
};