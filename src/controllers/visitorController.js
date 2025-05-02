const pool = require('../config/db');

// Create visitor (record setiap buka halaman)
const createVisitor = async (req, res) => {
  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const { page } = req.body;

    await pool.query(
      'INSERT INTO visitors (ip_address, user_agent, page_visited) VALUES ($1, $2, $3)',
      [ip, userAgent, page]
    );

    res.status(201).json({ message: 'Visitor recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to record visitor' });
  }
};

// Get visitor statistics (7 hari terakhir)
const getVisitorStats = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        TO_CHAR(visited_at, 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM visitors
      WHERE visited_at >= NOW() - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date ASC
    `);
    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch visitor stats' });
  }
};

module.exports = {
  createVisitor,
  getVisitorStats,
};
