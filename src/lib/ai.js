// LiteLLM API client for PatientFlux
// Using direct HTTP calls to avoid constructor issues

const LITELLM_ENDPOINT = process.env.LITELLM_ENDPOINT || 'http://91.108.112.45:4000'
const LITELLM_API_KEY = process.env.LITELLM_API_KEY || 'sk-hZrLR2IIKDrOHKW2B4nIsQ'

// AI Triage function for doctors
export async function performAITriage(symptoms, patientInfo) {
  try {
    const prompt = `
    As a medical AI assistant, analyze the following patient symptoms and provide triage assessment:
    
    Patient Information:
    - Age: ${patientInfo.age}
    - Gender: ${patientInfo.gender}
    - Visit Type: ${patientInfo.visitType}
    
    Symptoms: ${symptoms}
    
    Please provide:
    1. Urgency Level (Low/Medium/High/Critical)
    2. Recommended next steps
    3. Any immediate concerns
    4. Suggested department priority
    
    Format your response as JSON:
    {
      "urgency": "High",
      "nextSteps": ["Immediate blood work", "Cardiology consultation"],
      "concerns": ["Potential cardiac symptoms"],
      "departmentPriority": "Cardiology",
      "estimatedWaitTime": "30 minutes"
    }
    `

    const response = await fetch(`${LITELLM_ENDPOINT}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LITELLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant providing triage assessments. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      throw new Error(`LiteLLM API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No content received from LiteLLM')
    }

    // Try to parse JSON response
    try {
      return JSON.parse(content)
    } catch (parseError) {
      // Fallback: extract JSON from text if parsing fails
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('Invalid JSON response from AI')
    }

  } catch (error) {
    console.error('AI Triage error:', error)
    return {
      urgency: 'Medium',
      nextSteps: ['Standard triage assessment'],
      concerns: ['Unable to process AI assessment'],
      departmentPriority: 'General Medicine',
      estimatedWaitTime: '60 minutes'
    }
  }
}

// Natural language query for admin dashboard
export async function processNaturalLanguageQuery(query, context = {}) {
  try {
    const prompt = `
    As a hospital data analyst, process this natural language query about patient data:
    
    Query: "${query}"
    
    Available context: ${JSON.stringify(context)}
    
    Please provide:
    1. SQL-like query interpretation
    2. Data filters to apply
    3. Expected result type
    
    Format response as JSON:
    {
      "interpretation": "Show patients with high risk factors",
      "filters": {
        "isHighRisk": true,
        "date": "today"
      },
      "resultType": "patient_list",
      "suggestedQuery": "SELECT * FROM patients WHERE is_high_risk = true AND DATE(created_at) = CURRENT_DATE"
    }
    `

    const response = await fetch(`${LITELLM_ENDPOINT}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LITELLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a hospital data analyst. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      })
    })

    if (!response.ok) {
      throw new Error(`LiteLLM API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No content received from LiteLLM')
    }

    try {
      return JSON.parse(content)
    } catch (parseError) {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('Invalid JSON response from AI')
    }

  } catch (error) {
    console.error('Natural language query error:', error)
    return {
      interpretation: 'Unable to process query',
      filters: {},
      resultType: 'error',
      suggestedQuery: ''
    }
  }
}

// No-show prediction (placeholder for future implementation)
export async function predictNoShow(patientData) {
  // Mock implementation - in production, this would use historical data
  const riskFactors = [
    patientData.age > 60,
    patientData.visitType === 'Follow-up',
    patientData.department === 'Psychiatry'
  ]
  
  const noShowProbability = riskFactors.filter(Boolean).length * 0.2
  return {
    probability: Math.min(noShowProbability, 0.8),
    riskFactors: riskFactors.filter(Boolean),
    recommendation: noShowProbability > 0.5 ? 'Send reminder SMS' : 'Standard follow-up'
  }
} 