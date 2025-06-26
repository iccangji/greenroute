const { decode: decodeToken } = require('../utils/auth/token');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (decodeToken(token)) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized: Token invalid' });
    }
};

module.exports = verifyToken;
