const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const blogRoutes = require('./routes/blogRoutes');
const blogCommentsRoutes = require('./routes/blogCommentsRoutes');
const assessmentSubmissionRoutes = require('./routes/assessmentSubmissionRoutes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded images)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes placeholder
app.get('/', (req, res) => {
  res.send('API is running...');
});

// TODO: Import routes nanti disini
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/assessments', assessmentRoutes);

app.use('/api/assessments/answare', assessmentSubmissionRoutes);

app.use('/api/blogs', blogRoutes);

app.use('/api/blogs/comments', blogCommentsRoutes);

module.exports = app;
