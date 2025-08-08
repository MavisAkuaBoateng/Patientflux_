type TriageResult = {
  urgency: 'low' | 'medium' | 'high';
  nextStep: string;
};

export async function triageWithLLM(symptoms: string): Promise<TriageResult> {
  const baseUrl = process.env.LITELLM_BASE_URL;
  const apiKey = process.env.LITELLM_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama3-70b-8192';

  if (!baseUrl || !apiKey) {
    return ruleBasedTriage(symptoms);
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You are a clinical triage assistant. Reply ONLY with a strict JSON object with keys: urgency (low|medium|high) and nextStep (string). Do not include code blocks or extra text.'
          },
          { role: 'user', content: `Symptoms: ${symptoms}` },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      return ruleBasedTriage(symptoms);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    const urgency = ['low', 'medium', 'high'].includes(parsed.urgency)
      ? parsed.urgency
      : 'medium';
    const nextStep = typeof parsed.nextStep === 'string' ? parsed.nextStep : 'Doctor review recommended.';
    return { urgency, nextStep } as TriageResult;
  } catch (err) {
    return ruleBasedTriage(symptoms);
  }
}

export function ruleBasedTriage(symptoms: string): TriageResult {
  const s = symptoms.toLowerCase();
  const redFlags = ['chest pain', 'shortness of breath', 'unconscious', 'severe bleeding', 'stroke'];
  const yellowFlags = ['fever', 'vomiting', 'dehydration', 'fracture', 'severe'];

  if (redFlags.some((k) => s.includes(k))) {
    return { urgency: 'high', nextStep: 'Send to emergency department immediately.' };
  }
  if (yellowFlags.some((k) => s.includes(k))) {
    return { urgency: 'medium', nextStep: 'Prioritize for urgent doctor review within 30 minutes.' };
  }
  return { urgency: 'low', nextStep: 'Queue for routine doctor review.' };
}