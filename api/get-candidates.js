const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute('SELECT * FROM candidates ORDER BY created_at DESC');
    
    await connection.end();

    res.status(200).json(rows);

  } catch (error) {
    console.error('Database Error:', error);
    if (connection) {
      await connection.end();
    }
    res.status(500).json({ error: 'Failed to fetch candidates from the database.' });
  }
};