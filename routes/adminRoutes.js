const express = require('express');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'my_secret_key';

// Middlewares
const { verifyToken } = require('../middlewares/authentication');

// Setting router
let router = express.Router();

router.post('/admin-login', (req, res) => {
  const { username, password } = req.body;

  // Dummy admin check
  if (username === 'admin' && password === 'admin') {
    // Generate JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/admin-dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.admin.username}` });
});

module.exports = router;
