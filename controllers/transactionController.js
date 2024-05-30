const { firestore } = require('../config/firebase');

async function addTransaction(req, res) {
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
}

module.exports = { addTransaction };
