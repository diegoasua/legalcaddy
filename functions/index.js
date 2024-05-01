import { defineSecret } from "firebase-functions/params";
import { onRequest } from 'firebase-functions/v2/https';
import axios from 'axios';

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

export const simplifyText = onRequest(
    {
        secrets: [OPENAI_API_KEY],
    },
    async (request, response) => {
        const { text } = request.body;

        try {
            const apiKey = OPENAI_API_KEY.value();

            const apiResponse = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: "You are a legal assistant that simplifies and summarizes complex legal text into layman's terms.",
                        },
                        {
                            role: 'user',
                            content: "Simplify the following legal text into layman's terms and keep it short with bullet points, and make sure to highlight possible red flags:\n\n" + text,
                        },
                    ],
                    max_tokens: 600,
                    n: 1,
                    stop: null,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );

            const simplifiedText = apiResponse.data.choices[0].message.content.trim();
            response.json({ simplifiedText });
        } catch (error) {
            console.error('Error:', error);
            response.status(500).json({ error: 'An error occurred while simplifying the text.' });
        }
    }
);