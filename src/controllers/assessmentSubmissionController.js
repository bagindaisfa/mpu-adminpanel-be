const pool = require('../config/db');

// Helper: Hitung jumlah "iya" dan "tidak"
function countAnswers(answers) {
  let yesCount = 0;
  let noCount = 0;

  for (const key in answers) {
    if (answers[key].toLowerCase() === 'yes') {
      yesCount++;
    } else if (answers[key].toLowerCase() === 'no') {
      noCount++;
    }
  }

  return { yesCount, noCount };
}

const submitAssessment = async (req, res) => {
  const { answers, user_info } = req.body;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ message: 'Answers must be an object.' });
  }

  try {
    const { yesCount, noCount } = countAnswers(answers);
    const dominantAnswer = yesCount >= noCount ? 'yes' : 'no';

    let userName = null;
    let userEmail = null;
    let userPhone = null;

    if (dominantAnswer === 'yes') {
      if (
        !user_info ||
        !user_info.name ||
        !user_info.email ||
        !user_info.phone
      ) {
        return res.status(400).json({
          message:
            'Name, email, and phone are required for positive assessments.',
        });
      }
      userName = user_info.name;
      userEmail = user_info.email;
      userPhone = user_info.phone;
    }

    await pool.query(
      `INSERT INTO assessment_answers (user_name, user_email, user_phone, answers)
         VALUES ($1, $2, $3, $4)`,
      [userName, userEmail, userPhone, answers]
    );

    res.status(201).json({ message: 'Assessment submitted successfully.' });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  submitAssessment,
};
