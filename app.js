const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/user/transactions', transactionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
