// LiteLLM API client for PatientFlux
// Using direct HTTP calls to avoid constructor issues

const LITELLM_ENDPOINT = process.env.LITELLM_API_BASE || process.env.LITELLM_ENDPOINT || 'http://91.108.112.45:4000'
const LITELLM_API_KEY = process.env.LITELLM_API_KEY || 'sk-hZrLR2IIKDrOHKW2B4nIsQ'

// AI Triage function for doctors
export async function performAITriage(symptoms, patientInfo) {
  try {
    console.log('AI Triage - Using endpoint:', LITELLM_ENDPOINT)
    console.log('AI Triage - API Key available:', !!LITELLM_API_KEY)
    
    const prompt = `You are a medical AI assistant. Analyze the patient symptoms and provide a triage assessment.

Patient Information:
- Age: ${patientInfo.age}
- Gender: ${patientInfo.gender}
- Visit Type: ${patientInfo.visitType}

Symptoms: ${symptoms}

IMPORTANT: You must respond with ONLY valid JSON. Do not include any text before or after the JSON.

Required JSON structure:
{
  "urgency": "Low|Medium|High|Critical",
  "nextSteps": ["step1", "step2"],
  "concerns": ["concern1", "concern2"],
  "departmentPriority": "Department Name",
  "estimatedWaitTime": "time estimate"
}

Example response:
{"urgency":"High","nextSteps":["Immediate blood work","Cardiology consultation"],"concerns":["Potential cardiac symptoms"],"departmentPriority":"Cardiology","estimatedWaitTime":"30 minutes"}`

    console.log('AI Triage - Making API request to:', `${LITELLM_ENDPOINT}/v1/chat/completions`)
    
    const response = await fetch(`${LITELLM_ENDPOINT}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LITELLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'groq/deepseek-r1-distill-llama-70b',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant. You MUST respond with ONLY valid JSON. No text before or after. No markdown formatting. Just pure JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.1
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
    console.log('AI Response content:', content)
    
    try {
      return JSON.parse(content)
    } catch (parseError) {
      console.log('JSON parse error:', parseError.message)
      
      // Fallback: extract JSON from text if parsing fails
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[0]
          console.log('Extracted JSON:', extractedJson)
          return JSON.parse(extractedJson)
        } catch (extractError) {
          console.log('Extracted JSON parse error:', extractError.message)
        }
      }
      
      // Try to clean the response and parse again
      const cleanedContent = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      
      try {
        return JSON.parse(cleanedContent)
      } catch (cleanError) {
        console.log('Cleaned content parse error:', cleanError.message)
      }
      
      throw new Error(`Invalid JSON response from AI. Raw content: ${content.substring(0, 200)}...`)
    }

  } catch (error) {
    console.error('AI Triage error:', error)
    
    // Generate a fallback response based on symptoms keywords
    const fallbackResponse = generateFallbackTriage(symptoms, patientInfo)
    console.log('Using fallback triage response:', fallbackResponse)
    
    return {
      ...fallbackResponse,
      error: error.message,
      isFallback: true
    }
  }
}

// Fallback triage logic when AI fails
function generateFallbackTriage(symptoms, patientInfo) {
  const symptomsLower = symptoms.toLowerCase()
  
  // Determine urgency based on symptom keywords
  let urgency = 'Medium'
  let departmentPriority = 'General Medicine'
  let estimatedWaitTime = '60 minutes'
  let concerns = []
  let nextSteps = ['Standard triage assessment', 'Manual review required']
  
  // Check for critical symptoms
  if (symptomsLower.includes('chest pain') || symptomsLower.includes('heart') || symptomsLower.includes('cardiac')) {
    urgency = 'Critical'
    departmentPriority = 'Cardiology'
    estimatedWaitTime = 'Immediate'
    concerns = ['Potential cardiac symptoms - requires immediate attention']
    nextSteps = ['Immediate ECG', 'Cardiology consultation', 'Monitor vital signs']
  } else if (symptomsLower.includes('breathing') || symptomsLower.includes('shortness of breath') || symptomsLower.includes('dyspnea')) {
    urgency = 'High'
    departmentPriority = 'Emergency Medicine'
    estimatedWaitTime = '15 minutes'
    concerns = ['Respiratory distress']
    nextSteps = ['Oxygen therapy assessment', 'Chest X-ray', 'Emergency consultation']
  } else if (symptomsLower.includes('fever') && (symptomsLower.includes('high') || symptomsLower.includes('severe'))) {
    urgency = 'High'
    departmentPriority = 'Infectious Disease'
    estimatedWaitTime = '30 minutes'
    concerns = ['High fever - potential infection']
    nextSteps = ['Temperature monitoring', 'Blood work', 'Infection screening']
  } else if (symptomsLower.includes('headache') && (symptomsLower.includes('severe') || symptomsLower.includes('sudden'))) {
    urgency = 'High'
    departmentPriority = 'Neurology'
    estimatedWaitTime = '45 minutes'
    concerns = ['Severe headache - neurological assessment needed']
    nextSteps = ['Neurological examination', 'CT scan if indicated', 'Pain management']
  }
  
  // Age-based adjustments
  if (patientInfo.age > 65) {
    urgency = urgency === 'Low' ? 'Medium' : urgency
    concerns.push('Elderly patient - requires additional monitoring')
  }
  
  // Gender-specific considerations
  if (patientInfo.gender === 'Female' && symptomsLower.includes('abdominal')) {
    departmentPriority = 'Gynecology'
    concerns.push('Abdominal symptoms in female patient')
  }
  
  return {
    urgency,
    nextSteps,
    concerns,
    departmentPriority,
    estimatedWaitTime
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
        model: 'groq/deepseek-r1-distill-llama-70b',
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

// Test function to verify AI API connectivity
export async function testAIConnection() {
  try {
    console.log('Testing AI API connection...')
    console.log('Endpoint:', LITELLM_ENDPOINT)
    console.log('API Key available:', !!LITELLM_API_KEY)
    
    const response = await fetch(`${LITELLM_ENDPOINT}/v1/models`, {
      headers: {
        'Authorization': `Bearer ${LITELLM_API_KEY}`,
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Available models:', data.data?.map(m => m.id) || [])
      return { success: true, models: data.data }
    } else {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
    }
  } catch (error) {
    console.error('AI connection test failed:', error)
    return { success: false, error: error.message }
  }
} 