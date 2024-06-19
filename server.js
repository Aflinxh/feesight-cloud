const express = require('express');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
// const { storage, bucketName, loadModelFromGCS } = require('./gcsConfig');
const tf = require('@tensorflow/tfjs-node');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const bcrypt = require('bcrypt');
// const { PythonShell } = require('python-shell');

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Import the firestore module
const firestore = admin.firestore();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for production

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
  return jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '60d' });
}

// Middleware to verify JWT
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

// Route to add a new user
app.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Add logging to verify values
    console.log('Signup request:', { email, password, displayName });

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'All fields are required: email, password, displayName' });
    }

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
    res.status(500).json({ error: 'Failed to add user', message: error.message });
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Add logging to verify values
    console.log('Login request:', { email, password });

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required: email, password' });
    }

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

// Route to update user
app.put('/user', authenticateToken, async (req, res) => {
  try {
    const { email, displayName } = req.body;
    const userUpdate = {};
    if (email) userUpdate.email = email;
    if (displayName) userUpdate.displayName = displayName;

    await admin.auth().updateUser(req.user.uid, userUpdate);
    await firestore.collection('users').doc(req.user.uid).update(userUpdate);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.get('/user/transactions', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;  // Ambil tanggal dari query string
    let query = firestore.collection('users').doc(req.user.uid).collection('transactions');

    if (date) {
      // Jika tanggal diberikan, tambahkan filter untuk tanggal tersebut
      query = query.where('date', '==', date);
    }

    const transactionsSnapshot = await query.get();
    const transactions = [];
    transactionsSnapshot.forEach(doc => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Route to handle transactions
app.post('/user/transactions', authenticateToken, async (req, res) => {
  const transaction = {
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
    date: req.body.date
  };

  try {
    const createdTransaction = await firestore.collection('users').doc(req.user.uid).collection('transactions').add(transaction);
    res.status(200).json({ message: 'Transaction performed', id: createdTransaction.id });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

app.put('/user/transactions', authenticateToken, async (req, res) => {
  try {
    const { amount, type, category, date, id } = req.body;
    const transactionUpdate = { amount, type, category, date };

    await firestore.collection('users').doc(req.user.uid).collection('transactions').doc(id).update(transactionUpdate);

    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: error });
  }
});

app.delete('/user/transactions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const transactionRef = firestore.collection('users').doc(req.user.uid).collection('transactions').doc(id);
    const transactionDoc = await transactionRef.get();

    if (!transactionDoc.exists) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transactionRef.delete();

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Route to handle user logout
app.post('/logout', authenticateToken, async (req, res) => {
  try {
    await admin.auth().revokeRefreshTokens(req.user.uid);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Route to handle user deletion
app.delete('/user', authenticateToken, async (req, res) => {
  try {
    await admin.auth().deleteUser(req.user.uid);
    await firestore.collection('users').doc(req.user.uid).delete();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Route to handle predictions for all tickers
app.post('/predict', (req, res) => {
  const { end_date } = req.body;

  if (!end_date) {
      return res.status(400).json({ error: 'Missing end_date parameter' });
  }

  const pythonScript = 'predict_stock.py';
  const command = `python3 ${pythonScript} ${end_date}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
        console.error('Error while running Python script:', err);
        return res.status(500).json({ error: err });
    }

    console.log('Python script stdout:', stdout);
    console.log('Python script stderr:', stderr);

    try {
        const predictions = JSON.parse(stdout.trim());
        res.json(predictions);
    } catch (error) {
        console.error('Error parsing Python script output:', error);
        res.status(500).json({ error: 'Invalid response from Python script' });
    }
});

});
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
