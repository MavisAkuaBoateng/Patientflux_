import type { NextApiRequest, NextApiResponse } from 'next';
import { triageWithLLM } from '../../lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { symptoms } = req.body || {};
  if (!symptoms) return res.status(400).json({ error: 'Missing symptoms' });

  const result = await triageWithLLM(String(symptoms));
  return res.status(200).json(result);
}