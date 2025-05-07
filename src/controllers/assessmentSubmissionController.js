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
    let companyName = null;

    if (dominantAnswer === 'yes') {
      if (
        !user_info ||
        !user_info.name ||
        !user_info.email ||
        !user_info.phone ||
        !user_info.company_name
      ) {
        return res.status(400).json({
          message:
            'Name, email, and phone are required for positive assessments.',
        });
      }
      userName = user_info.name;
      userEmail = user_info.email;
      userPhone = user_info.phone;
      companyName = user_info.company_name;
    }

    await pool.query(
      `INSERT INTO assessment_answers (user_name, user_email, user_phone, company_name, answers)
         VALUES ($1, $2, $3, $4, $5)`,
      [userName, userEmail, userPhone, companyName, answers]
    );

    res.status(201).json({ message: 'Assessment submitted successfully.' });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getAllAssessmentAnswers = async (req, res) => {
  try {
    // Ambil semua jawaban
    const result = await pool.query(
      `SELECT id, user_name, user_email, user_phone, company_name, answers, created_at
       FROM assessment_answers
       ORDER BY created_at DESC`
    );

    const questionsRes = await pool.query(
      `SELECT id, question_text FROM assessment_questions ORDER BY id ASC`
    );
    const questionMap = {};
    questionsRes.rows.forEach((q) => {
      questionMap[q.id] = q.question_text;
    });

    const formatted = result.rows.map((entry) => {
      const answerEntries = Object.entries(entry.answers || {});
      const answers = answerEntries.map(([questionId, answerValue]) => ({
        question_text:
          questionMap[parseInt(questionId)] || `Question ${questionId}`,
        answer: answerValue,
      }));

      return {
        id: entry.id,
        name: entry.user_name,
        email: entry.user_email,
        phone: entry.user_phone,
        company_name: entry.company_name,
        created_at: entry.created_at,
        answers,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error getting assessment answers:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  getAllAssessmentAnswers,
  submitAssessment,
};
