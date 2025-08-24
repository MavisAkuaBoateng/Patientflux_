// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: "You are a helpful medical assistant. Provide clear, safe, and general guidance, but never replace professional medical advice." },
          { role: 'user', content: query },
        ],
      }),
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I couldn’t generate a response.";

    return res.status(200).json({ summary: answer });

  } catch (err: any) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
