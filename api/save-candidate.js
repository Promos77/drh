const mysql = require('mysql');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const candidate = req.body;
    
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await new Promise((resolve, reject) => {
            connection.connect((error) => {
                if (error) reject(error);
                resolve();
            });
        });

        const query = `INSERT INTO candidates (name, company, location, status, created_at) VALUES (?, ?, ?, 'new', NOW())`;
        
        await new Promise((resolve, reject) => {
            connection.query(query, [
                candidate.name,
                candidate.company,
                candidate.location
            ], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        res.status(201).json({ message: 'Candidate saved successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.end();
    }
}
