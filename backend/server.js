require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `
            Analyze the following content for potential scams and return a JSON object with the specified structure.

            Content to analyze:
            ---
            ${content}
            ---

            JSON Structure to follow:
            {
                "riskScore": "A number from 0 to 100 indicating the level of risk.",
                "riskLevel": "A string that is one of: 'safe', 'low', 'medium', 'high'.",
                "riskMessage": "A concise, one-sentence summary of the risk assessment.",
                "details": [
                    {
                        "type": "A string that is one of: 'info', 'warning', 'danger'.",
                        "title": "A short, descriptive title for the finding.",
                        "message": "A detailed explanation of this specific finding."
                    }
                ],
                "recommendations": [
                    "A string containing a clear, actionable recommendation for the user."
                ]
            }

            Your response must be a valid JSON object that conforms to this structure.
            Do not include any text or markdown formatting before or after the JSON object.
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        console.log('Raw Gemini API response text:', text); // Add this line for debugging

        // Safely parse the response from the model
        const analysisResult = parseGeminiResponse(text);

        if (analysisResult === undefined) {
            console.error('FATAL: parseGeminiResponse returned undefined. This should not happen.');
            return res.status(500).json({ error: 'Failed to analyze content due to critical internal error.' });
        }

        res.json(analysisResult);
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ error: 'Failed to analyze content with AI' });
    }
});

/**
 * Safely parses the text response from the Gemini model.
 * The model may return the JSON wrapped in markdown (```json ... ```).
 * @param {string} text - The raw text from the model response.
 * @returns {object} - The parsed JSON object or an error object.
 */
function parseGeminiResponse(text) {
    try {
        // Find the JSON block using a regular expression
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);

        if (!jsonMatch || !jsonMatch[1] && !jsonMatch[2]) {
             console.error('No JSON found in Gemini response.');
             return {
                riskScore: 50,
                riskLevel: 'medium',
                riskMessage: 'AI analysis failed: no valid JSON found in response.',
                details: [{
                    type: 'danger',
                    title: 'Invalid AI Response',
                    message: 'The AI model returned a response that did not contain a valid JSON object. This might be a temporary issue.'
                }],
                recommendations: [
                    'Please try analyzing the content again.',
                    'If the problem continues, consider simplifying the content or checking the system status.'
                ]
            };
        }

        // Extract the JSON string from the match
        const jsonString = jsonMatch[1] || jsonMatch[2];

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        console.error('Original text:', text); // Log the problematic text
        return {
            riskScore: 50,
            riskLevel: 'medium',
            riskMessage: 'Could not fully analyze the content due to a formatting issue. Please review carefully.',
            details: [{
                type: 'warning',
                title: 'Analysis Incomplete',
                message: 'The AI response was not in the expected format. This is a system issue, but you should still treat the original content with caution.'
            }],
            recommendations: [
                'Manually review the content for any red flags.',
                'When in doubt, do not click links or provide personal information.'
            ]
        };
    }
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
