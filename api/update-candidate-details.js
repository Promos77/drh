const { client } = require('../../src/api/clientApi');

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  const { id, summary, parsed_data, notes } = req.body;

  try {
    await client.query(
      'UPDATE candidates SET summary = $1, parsed_data = $2, notes = $3 WHERE id = $4',
      [summary, parsed_data, notes, id]
    );
    res.status(200).json({ message: 'Candidate details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update candidate details' });
  }
}
