const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const blogRoutes = require('./routes/blogRoutes');
const blogCommentsRoutes = require('./routes/blogCommentsRoutes');
const assessmentSubmissionRoutes = require('./routes/assessmentSubmissionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const categoriesRoute = require('./routes/categoriesRoutes');
const contactRoutes = require('./routes/contactRoutes');

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
app.set('trust proxy', true);

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

app.use('/api/categories', categoriesRoute);

app.use('/api/user-contact/', contactRoutes);

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, number, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Message from ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nNumber: ${number}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

module.exports = app;
