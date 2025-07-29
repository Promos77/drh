const { GoogleGenerativeAI } = require('@google/generative-ai');
const formidable = require('formidable');
const pdf = require('pdf-parse');
const fs = require('fs');

module.exports = async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error parsing the form' });
        }

        const cvFile = files.cv;
        if (!cvFile) {
            return res.status(400).json({ error: 'No CV file uploaded' });
        }

        try {
            const dataBuffer = fs.readFileSync(cvFile.filepath);
            const data = await pdf(dataBuffer);
            const cvText = data.text;

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
            Agis en tant qu'expert en recrutement technique. Analyse le texte de CV suivant et extrais les informations UNIQUEMENT au format JSON. Ne fournis aucune explication, seulement le JSON.

            Le JSON doit avoir la structure suivante :
            {
              "name": "Nom complet du candidat",
              "email": "Adresse email du candidat",
              "phone": "Numéro de téléphone du candidat",
              "summary": "Un résumé concis de 2-3 phrases du profil du candidat.",
              "skills": ["Compétence 1", "Compétence 2", "Compétence 3"],
              "experience_years": "Nombre total d'années d'expérience",
              "education": "Dernier diplôme obtenu et l'école"
            }

            Voici le texte du CV à analyser :
            ---
            ${cvText}
            ---
          `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            const jsonData = JSON.parse(text);
            res.status(200).json(jsonData);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};