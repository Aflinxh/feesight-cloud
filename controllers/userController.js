const admin = require('firebase-admin');
const { firestore } = require('../config/firebase');

async function updateUser(req, res) {
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
}

module.exports = { updateUser };
