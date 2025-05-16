const pool = require('../config/db');
const dayjs = require('dayjs');

const scheduleConsultation = async (req, res) => {
  const { name, email, datetime } = req.body;
  console.log('Received data:', req.body);
  const formattedDate = dayjs(datetime).format('YYYYMMDDTHHmmss');
  const eventLocation = 'Conference Room';
  const eventDescription = `Consultation with ${name}`;

  const icalendarData = `BEGIN:VCALENDAR
    VERSION:2.0
    BEGIN:VEVENT
    UID:${Date.now()}@mpupeoplesolution.com
    DTSTAMP:${formattedDate}Z
    SUMMARY:Consultation: ${name}
    DTSTART:${formattedDate}Z
    DTEND:${formattedDate}Z
    LOCATION:${eventLocation}
    DESCRIPTION:${eventDescription}
    ATTENDEE;CN="${name}";ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED:MAILTO:${email}
    ORGANIZER;CN="${process.env.EMAIL_USER}":MAILTO:${process.env.EMAIL_USER}
    END:VEVENT
    END:VCALENDAR`;

  try {
    const response = await fetch(
      `https://mail.mpupeoplesolution.com/SOGo/dav/public/${
        process.env.EMAIL_USER
      }/Calendar/personal/consultation-${Date.now()}.ics`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/calendar',
          Authorization: `Basic ${btoa(
            `${process.env.EMAIL_USER}:${process.env.EMAIL_PASS}`
          )}`,
        },
        body: icalendarData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bad status: ${response.status} - ${errorText}`);
    }
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
      [data.name, data.email, data.datetime]
    );
    console.log('Event created successfully');
  } catch (error) {
    console.error('Failed to schedule consultation:', error);
    throw new Error('Error scheduling consultation');
  }
};

module.exports = { scheduleConsultation };
