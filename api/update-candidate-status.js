const { client } = require('../../src/api/clientApi');

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  const { id, status } = req.body;

  try {
    await client.query(
      'UPDATE candidates SET status = $1 WHERE id = $2',
      [status, id]
    );
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
}
