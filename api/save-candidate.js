// On utilise la librairie 'mysql2' et sa version avec "Promises" pour un code plus propre
const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
  // On vérifie que la méthode est bien POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // On récupère les données envoyées par le frontend
  const { title, company, location, url } = req.body;

  // On vérifie que les données essentielles sont présentes
  if (!title || !company) {
    return res.status(400).json({ error: 'Missing required candidate data' });
  }

  let connection;
  try {
    // On établit la connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // On prépare la requête SQL pour éviter les injections SQL (plus sécurisé)
    const sql = 'INSERT INTO candidates (name, company, location, source_url, status) VALUES (?, ?, ?, ?, ?)';
    const values = [title, company, location || null, url || null, 'Sourced'];

    // On exécute la requête
    await connection.execute(sql, values);

    // On ferme la connexion
    await connection.end();

    // On envoie une réponse de succès
    res.status(201).json({ message: 'Candidate saved successfully' });

  } catch (error) {
    // En cas d'erreur, on loge le détail pour le débogage sur Vercel
    console.error('Database Error:', error);

    // On ferme la connexion si elle était ouverte
    if (connection) {
      await connection.end();
    }
    
    // On envoie une réponse d'erreur générique au client
    res.status(500).json({ error: 'Failed to save candidate to the database.' });
  }
};