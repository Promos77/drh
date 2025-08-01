const formidable = require('formidable');
const pdfParse = require('pdf-parse');
const { client } = require('../../src/api/clientApi');
const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const cvFile = files.cv;
    if (!cvFile) {
      return res.status(400).json({ error: 'No CV file provided' });
    }

    try {
      const dataBuffer = await pdfParse(cvFile);
      const text = dataBuffer.text;

      // Send to Gemini API
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Analyse le CV suivant et extrait les informations suivantes: nom, email, téléphone, résumé, compétences, années d'expérience, éducation. CV: ${text}`
                }
              ]
            }
          ]
        })
      });

      if (!geminiResponse.ok) {
        throw new Error('Gemini API error');
      }

      const geminiData = await geminiResponse.json();
      const parsedData = geminiData.candidates[0].content.parts[0].text;

      // Parse the response (this part may need adjustment based on Gemini's actual response)
      const result = {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        summary: parsedData.summary,
        skills: parsedData.skills.split(', '),
        experience_years: parsedData.experience_years,
        education: parsedData.education
      };

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse CV' });
    }
  });
}
