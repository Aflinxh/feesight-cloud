const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const admin = require('firebase-admin');

async function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await admin.auth().getUser(decodedToken.uid);
    const validSince = new Date(user.tokensValidAfterTime).getTime() / 1000;

    if (decodedToken.iat < validSince) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error authenticating token:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = { authenticateToken };
