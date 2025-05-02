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
const dashboardRoutes = require('./routes/dashboardRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://admin.mpupeoplesolution.com',
];

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // Allow the requested origin
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
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

app.use('/api/comments', blogCommentsRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/visitors', visitorRoutes);

module.exports = app;
