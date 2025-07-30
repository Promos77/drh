const mysql = require('mysql');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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

        const query = 'SELECT * FROM candidates';
        
        const results = await new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.end();
    }
}
