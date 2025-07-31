const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'Candidate ID and status are required.' });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [result] = await connection.execute(
      'UPDATE candidates SET status = ? WHERE id = ?',
      [status, id]
    );
    
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    res.status(200).json({ message: 'Candidate status updated successfully.' });

  } catch (error) {
    console.error('Database Error:', error);
    if (connection) {
      await connection.end();
    }
    res.status(500).json({ error: 'Failed to update candidate status in the database.' });
  }
};