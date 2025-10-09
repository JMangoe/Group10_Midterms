const validateRegistration = (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username || username.trim() === '') {
        errors.push('Username is required');
    }

    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username || username.trim() === '') {
        errors.push('Username is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
        success: false,
        errors: errors
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
};