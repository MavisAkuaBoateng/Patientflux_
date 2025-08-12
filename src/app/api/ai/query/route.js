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
  
  // Parse analytics/statistics queries
  if (queryLower.includes('average wait time') || queryLower.includes('avg wait time') || queryLower.includes('mean wait time')) {
    return {
      interpretation: 'Average wait time analysis',
      filters: { analytics: 'waitTime' },
      resultType: 'analytics'
    }
  }
  
  if (queryLower.includes('total patients') || queryLower.includes('how many patients') || queryLower.includes('patient count')) {
    return {
      interpretation: 'Total patient count',
      filters: { analytics: 'patientCount' },
      resultType: 'analytics'
    }
  }
  
  if (queryLower.includes('critical patients') || queryLower.includes('critical count')) {
    return {
      interpretation: 'Critical patients count',
      filters: { analytics: 'criticalCount' },
      resultType: 'analytics'
    }
  }
  
  if (queryLower.includes('waiting patients') || queryLower.includes('patients waiting')) {
    return {
      interpretation: 'Waiting patients count',
      filters: { analytics: 'waitingCount' },
      resultType: 'analytics'
    }
  }
  
  if (queryLower.includes('department stats') || queryLower.includes('department statistics') || queryLower.includes('by department')) {
    return {
      interpretation: 'Department statistics',
      filters: { analytics: 'departmentStats' },
      resultType: 'analytics'
    }
  }
  
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

// Calculate analytics based on filters
async function calculateAnalytics(filters) {
  try {
    let query = supabase.from('patients').select('*')
    
    // Apply any department filters for analytics
    if (filters.department) {
      query = query.eq('department', filters.department)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw error
    }
    
    const patients = data || []
    const waitingPatients = patients.filter(p => p.status === 'waiting')
    
    // Calculate average wait time
    const now = new Date()
    const waitTimes = waitingPatients.map(patient => {
      const checkInTime = new Date(patient.check_in_time)
      return Math.floor((now - checkInTime) / (1000 * 60)) // Convert to minutes
    })
    
    const avgWaitTime = waitTimes.length > 0 
      ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
      : 0
    
    // Calculate various counts
    const criticalCount = patients.filter(p => p.priority === 'Critical').length
    const highCount = patients.filter(p => p.priority === 'High').length
    const normalCount = patients.filter(p => p.priority === 'Normal').length
    const waitingCount = waitingPatients.length
    const totalCount = patients.length
    
    // Calculate department stats
    const departmentStats = {}
    patients.forEach(patient => {
      if (!departmentStats[patient.department]) {
        departmentStats[patient.department] = { total: 0, waiting: 0, avgWait: 0 }
      }
      departmentStats[patient.department].total++
      if (patient.status === 'waiting') {
        departmentStats[patient.department].waiting++
      }
    })
    
    // Calculate average wait time per department
    Object.keys(departmentStats).forEach(dept => {
      const deptPatients = waitingPatients.filter(p => p.department === dept)
      const deptWaitTimes = deptPatients.map(patient => {
        const checkInTime = new Date(patient.check_in_time)
        return Math.floor((now - checkInTime) / (1000 * 60))
      })
      departmentStats[dept].avgWait = deptWaitTimes.length > 0 
        ? Math.round(deptWaitTimes.reduce((sum, time) => sum + time, 0) / deptWaitTimes.length)
        : 0
    })
    
    return {
      avgWaitTime: `${avgWaitTime} minutes`,
      totalPatients: totalCount,
      waitingPatients: waitingCount,
      criticalPatients: criticalCount,
      highPriorityPatients: highCount,
      normalPatients: normalCount,
      departmentStats: Object.entries(departmentStats).map(([dept, stats]) => ({
        department: dept,
        total: stats.total,
        waiting: stats.waiting,
        avgWait: `${stats.avgWait} minutes`
      }))
    }
  } catch (error) {
    console.error('Error calculating analytics:', error)
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
      if (keywordResult.resultType === 'analytics') {
        // Handle analytics queries
        const analytics = await calculateAnalytics(keywordResult.filters)
        
        return NextResponse.json({
          interpretation: keywordResult.interpretation,
          filters: keywordResult.filters,
          resultType: keywordResult.resultType,
          data: analytics,
          timestamp: new Date().toISOString()
        })
      } else {
        // Handle patient list queries
        const patients = await fetchPatientsByFilters(keywordResult.filters)
        
        return NextResponse.json({
          interpretation: keywordResult.interpretation,
          filters: keywordResult.filters,
          resultType: keywordResult.resultType,
          data: patients,
          timestamp: new Date().toISOString()
        })
      }
    }

    // If no keyword match, try LLM parsing
    try {
      const queryResult = await processNaturalLanguageQuery(query, context || {})
      
      // If LLM parsing fails, return user-friendly error
      if (queryResult.interpretation === 'Unable to process query') {
        return NextResponse.json({
          interpretation: 'I couldn\'t understand your query. Try asking about specific departments, patient priorities, status, or analytics like "average wait time" or "total patients".',
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
        interpretation: 'I couldn\'t process your query. Try asking about specific departments, patient priorities, status, or analytics like "average wait time" or "total patients".',
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