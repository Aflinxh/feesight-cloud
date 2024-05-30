const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

function generateToken(user) {
  return jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '60d' });
}

module.exports = { generateToken };
