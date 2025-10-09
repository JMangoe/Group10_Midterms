const { registerUser, authenticateUser } = require('../services/Services');

const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const result = await registerUser(username, password, role);

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authenticateUser(username, password);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(401).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};