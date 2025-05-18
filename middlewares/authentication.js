const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my_secret_key';
function verifyToken(req, res, next) {

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token.' });
  }
}

module.exports = {
  verifyToken
};