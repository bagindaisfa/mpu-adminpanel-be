const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded images)
app.use('/uploads', express.static('uploads'));

// Routes placeholder
app.get('/', (req, res) => {
  res.send('API is running...');
});

// TODO: Import routes nanti disini
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

module.exports = app;
