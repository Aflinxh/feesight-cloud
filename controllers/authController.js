const admin = require('firebase-admin');
const { firestore } = require('../config/firebase');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/tokenUtils');
const { comparePasswords } = require('../utils/passwordUtils');

async function signup(req, res) {
  try {
    const { email, password, displayName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    const userData = { email, displayName, passwordHash: hashedPassword };
    await firestore.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({ id: userRecord.uid, ...userData });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user', message: 'The email address is already in use by another account' });
  }
}

async function login(req, res) {
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
}

module.exports = { signup, login };
