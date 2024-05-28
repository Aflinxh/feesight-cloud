const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

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

// Function to compare provided password with hashed password
async function comparePasswords(plainPassword, hashedPassword) {
  try {
    // Compare the provided password with the hashed password
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Error comparing passwords');
  }
}

// Route to add a new user
// Route to add a new user
app.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName // Optional
    });

    // Add user data to Firestore, including the hashed password
    const userData = {
      email,
      displayName,
      passwordHash: hashedPassword
    };

    await firestore.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({ id: userRecord.uid, ...userData });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' , message : 'The email address is already in use by another account'});
  }
});


// Route to handle user login
// Route to handle user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user record from Firestore
    const userSnapshot = await firestore.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      // If no user is found, return an error response
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Compare provided password with hashed password
    const isPasswordValid = await comparePasswords(password, userData.passwordHash);

    if (!isPasswordValid) {
      // If password is invalid, return an error response
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If authentication is successful, return a success response
    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (error) {
    console.error('Error logging in user:', error);
    // If authentication fails due to any error, return an error response
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/getUser', async (req, res) => {
  

})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


