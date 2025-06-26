const User = require('../models/user.model');
const { hash: hashPassword, compare: comparePassword } = require('../utils/auth/password');
const { generate: generateToken } = require('../utils/auth/token');

exports.signup = async (req, res) => {
    try {
        const { name, password } = req.body;
        const hashedPassword = hashPassword(password.trim());

        const user = await User.create({
            name,
            password: hashedPassword
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            role: user.role
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: error.name
        });
    }
};

exports.signin = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ where: { name } });

        if (!user || !(comparePassword(password.trim(), user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        res.json({
            message: 'success',
            token,
            role: user.role
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: error.name
        });
    }
}