// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;

  // 🔒 Add a system disclaimer so the model doesn’t give unsafe medical advice
  const systemPrompt = `
  You are an assistant that can answer general knowledge questions. 
  ⚠️ You are not a doctor — do not provide medical prescriptions. 
  For medical issues, remind users to see a qualified health professional.
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "No response.";

  res.status(200).json({ text });
}
