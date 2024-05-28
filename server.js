const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Import the firestore module
const firestore = admin.firestore();

// Middleware to parse JSON bodies
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret

// Function to compare provided password with hashed password
async function comparePasswords(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Error comparing passwords');
  }
}

// Function to generate JWT
function generateToken(user) {
  return jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Route to add a new user
app.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    const userData = {
      email,
      displayName,
      passwordHash: hashedPassword
    };

    await firestore.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({ id: userRecord.uid, ...userData });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user', message: 'The email address is already in use by another account' });
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnapshot = await firestore.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const isPasswordValid = await comparePasswords(password, userData.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ uid: userDoc.id, email: userData.email });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Route to handle transactions
app.post('/users/transactions', authenticateToken, async (req, res) => {
  const transaction = {
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
    date: req.body.date
  };

  try {
    await firestore.collection('users').doc(req.user.uid).collection('transactions').add(transaction);

    res.status(200).json({ message: 'Transaction performed' });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
