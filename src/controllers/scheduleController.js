const pool = require('../config/db');
const dayjs = require('dayjs');
const fs = require('fs');
const nodemailer = require('nodemailer');

const createICSFile = (
  name,
  email,
  description,
  location,
  startDate,
  endDate
) => {
  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${Date.now()}@mpupeoplesolution.com
DTSTAMP:${startDate}
SUMMARY:Consultation: ${name}
DTSTART:${startDate}
DTEND:${endDate}
LOCATION:${location}
DESCRIPTION:${description}
ATTENDEE;CN="${name}";ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED:MAILTO:${email}
ORGANIZER;CN="${process.env.EMAIL_USER}":MAILTO:${process.env.EMAIL_USER}
END:VEVENT
END:VCALENDAR`;

  const fileName = `${name.replace(/\s/g, '_')}.ics`;
  fs.writeFileSync(fileName, icsContent);
  return fileName;
};

const sendEmailWithICS = async (to, subject, text, fileName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.mpupeoplesolution.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Masukkan email Anda
        pass: process.env.EMAIL_PASS, // Masukkan password aplikasi
      },
    });

    const mailOptions = {
      from: `"MPU Consultation" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments: [
        {
          filename: fileName,
          path: `./${fileName}`,
          contentType: 'text/calendar',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const scheduleConsultation = async (req, res) => {
  const { name, email, datetime } = req.body;
  const startDate = dayjs(datetime).format('YYYYMMDDTHHmmss[Z]');
  const endDate = dayjs(datetime).add(1, 'hour').format('YYYYMMDDTHHmmss[Z]');

  const eventLocation = 'Conference Room';
  const eventDescription = `Consultation with ${name}`;

  const fileName = createICSFile(
    name,
    email,
    eventDescription,
    eventLocation,
    startDate,
    endDate
  );

  try {
    await sendEmailWithICS(
      email,
      'Undangan Konsultasi MPU',
      'Berikut adalah undangan konsultasi Anda.',
      fileName
    );

    await sendEmailWithICS(
      process.env.EMAIL_USER,
      'Undangan Konsultasi MPU',
      `Berikut adalah undangan konsultasi dengan ${name}, ${email}.`,
      fileName
    );

    await createSchedule({ name, email, datetime });
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Failed to schedule consultation:', error);
    res.status(500).json({ message: 'Error scheduling consultation' });
  }
};

const createSchedule = async (data) => {
  try {
    const result = await pool.query(
      'INSERT INTO schedule (name, email, datetime) VALUES ($1, $2, $3) RETURNING *',
      [
        data.name,
        data.email,
        dayjs(data.datetime).format('YYYY-MM-DD HH:mm:ss'),
      ]
    );
    console.log('Event created successfully');
  } catch (error) {
    console.error('Failed to schedule consultation:', error);
    throw new Error('Error scheduling consultation');
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM schedule ORDER BY datetime DESC'
    );
    res.status(201).json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

module.exports = { scheduleConsultation, getAllSchedules };
