const express = require('express');
const router = express.Router();

// For Gemini API integration
// You'll need to set GEMINI_API_KEY in your .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// System prompt for medical assistant
const MEDICAL_SYSTEM_PROMPT = `You are MedBot, a helpful AI health assistant. You provide general medical information and health advice.

Your role includes:
- Explaining common diseases and their symptoms
- Providing information about verified treatments and cures
- Sharing evidence-based medical information
- Recommending when to see a doctor
- Offering wellness and prevention tips

When discussing diseases, always include:
- Common symptoms
- Verified treatment options
- When to seek professional medical help
- Prevention methods

IMPORTANT:
- Always remind users that you are NOT a substitute for professional medical advice
- Encourage users to consult with qualified healthcare professionals for diagnosis and treatment
- Never prescribe specific medications without professional guidance
- Share general information about evidence-based treatments
- Be empathetic and supportive in your responses
- If a question seems urgent or involves severe symptoms, strongly advise seeking immediate medical attention

CRITICAL: Only use simple plain text. Do not use bold, italics, markdown, asterisks, lists, numbered items, or any formatting. Just write simple paragraphs separated by line breaks.
Keep responses concise, clear, and informative.`;

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'API key not configured' });
    }

    // Call Gemini 2.5 Pro API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: {
            text: MEDICAL_SYSTEM_PROMPT
          }
        },
        contents: {
          parts: [
            {
              text: message
            }
          ]
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ message: 'Error getting response from AI' });
    }

    // Extract reply from Gemini response
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request.';

    res.json({ reply });

  } catch (error) {
    console.error('MedBot error:', error);
    res.status(500).json({ message: 'Error processing request: ' + error.message });
  }
});

module.exports = router;
