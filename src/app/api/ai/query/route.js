import { NextResponse } from 'next/server'
import { processNaturalLanguageQuery } from '../../../../lib/ai'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Keyword-based query parser
function parseQueryKeywords(query) {
  const queryLower = query.toLowerCase()
  
  // Initialize filters
  const filters = {}
  let interpretation = ''
  let resultType = 'patientList'
  
  // Parse urgency/priority
  if (queryLower.includes('critical')) {
    filters.priority = 'Critical'
    interpretation += 'Critical '
  } else if (queryLower.includes('high')) {
    filters.priority = 'High'
    interpretation += 'High priority '
  } else if (queryLower.includes('stable')) {
    filters.priority = 'Normal'
    interpretation += 'Stable '
  }
  
  // Parse department
  const departments = [
    'cardiology', 'pediatrics', 'gynecology', 'orthopedics', 
    'neurology', 'psychiatry', 'dermatology', 'ophthalmology',
    'ent', 'urology', 'oncology', 'emergency medicine', 
    'surgery', 'radiology', 'general medicine'
  ]
  
  for (const dept of departments) {
    if (queryLower.includes(dept)) {
      filters.department = dept.charAt(0).toUpperCase() + dept.slice(1)
      if (dept === 'ent') {
        filters.department = 'ENT (Ear, Nose, Throat)'
      }
      interpretation += `patients in ${filters.department}`
      break
    }
  }
  
  // Parse status
  if (queryLower.includes('waiting')) {
    filters.status = 'waiting'
    interpretation += ' waiting patients'
  } else if (queryLower.includes('in progress') || queryLower.includes('in-progress')) {
    filters.status = 'in-progress'
    interpretation += ' patients in progress'
  } else if (queryLower.includes('completed')) {
    filters.status = 'completed'
    interpretation += ' completed patients'
  }
  
  // Parse high risk
  if (queryLower.includes('high risk') || queryLower.includes('high-risk')) {
    filters.is_high_risk = true
    interpretation += ' high risk patients'
  }
  
  // Parse "all patients"
  if (queryLower.includes('all patients')) {
    interpretation = 'All patients'
    if (filters.department) {
      interpretation += ` in ${filters.department}`
    }
  }
  
  // If no specific filters found, return null to use LLM
  if (Object.keys(filters).length === 0) {
    return null
  }
  
  return {
    interpretation: interpretation || 'Filtered patients',
    filters,
    resultType
  }
}

// Fetch patients based on filters
async function fetchPatientsByFilters(filters) {
  try {
    let query = supabase.from('patients').select('*')
    
    // Apply filters
    if (filters.priority) {
      query = query.eq('priority', filters.priority)
    }
    if (filters.department) {
      query = query.eq('department', filters.department)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.is_high_risk !== undefined) {
      query = query.eq('is_high_risk', filters.is_high_risk)
    }
    
    // Order by priority and check-in time
    query = query.order('priority', { ascending: false })
    query = query.order('check_in_time', { ascending: true })
    
    const { data, error } = await query
    
    if (error) {
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}

// POST /api/ai/query - Process natural language query
export async function POST(request) {
  try {
    const body = await request.json()
    const { query, context } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 }
      )
    }

    // First, try keyword-based parsing
    const keywordResult = parseQueryKeywords(query)
    
    if (keywordResult) {
      // Use keyword-based parsing
      const patients = await fetchPatientsByFilters(keywordResult.filters)
      
      return NextResponse.json({
        interpretation: keywordResult.interpretation,
        filters: keywordResult.filters,
        resultType: keywordResult.resultType,
        data: patients,
        timestamp: new Date().toISOString()
      })
    }

    // If no keyword match, try LLM parsing
    try {
      const queryResult = await processNaturalLanguageQuery(query, context || {})
      
      // If LLM parsing fails, return user-friendly error
      if (queryResult.interpretation === 'Unable to process query') {
        return NextResponse.json({
          interpretation: 'I couldn\'t understand your query. Try asking about specific departments, patient priorities, or status.',
          filters: {},
          resultType: 'error',
          data: [],
          timestamp: new Date().toISOString()
        })
      }
      
      return NextResponse.json({ 
        result: queryResult,
        timestamp: new Date().toISOString()
      })
    } catch (llmError) {
      console.error('LLM parsing error:', llmError)
      return NextResponse.json({
        interpretation: 'I couldn\'t process your query. Try asking about specific departments, patient priorities, or status.',
        filters: {},
        resultType: 'error',
        data: [],
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('AI Query API error:', error)
    return NextResponse.json(
      { 
        interpretation: 'An error occurred while processing your query. Please try again.',
        filters: {},
        resultType: 'error',
        data: [],
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 