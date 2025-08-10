// Patient Management Library for PatientFlux
import { createClient } from '@supabase/supabase-js'
import { logPatientCheckIn } from './blockchain.js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Hospital departments configuration
export const HOSPITAL_DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Gynecology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'Dermatology',
  'Ophthalmology',
  'ENT (Ear, Nose, Throat)',
  'Urology',
  'Oncology',
  'Emergency Medicine',
  'Surgery',
  'Radiology'
]

// Visit types
export const VISIT_TYPES = [
  'New Patient',
  'Follow-up',
  'Post-op',
  'Emergency',
  'Consultation'
]

// Risk assessment function
export function assessPatientRisk(patientData) {
  const riskFactors = []
  let isHighRisk = false
  let priority = 'Normal'

  // Age-based risk assessment
  if (patientData.age > 60) {
    riskFactors.push('Elderly')
    isHighRisk = true
  }

  // Gender and age specific risks
  if (patientData.gender === 'Female' && patientData.age >= 12 && patientData.age <= 55) {
    // Check for pregnancy-related keywords in symptoms
    const pregnancyKeywords = ['pregnant', 'pregnancy', 'gestation', 'maternal']
    if (pregnancyKeywords.some(keyword => 
      patientData.symptoms.toLowerCase().includes(keyword)
    )) {
      riskFactors.push('Pregnant')
      isHighRisk = true
    }
  }

  // Chronic condition detection
  const chronicKeywords = [
    'diabetes', 'hypertension', 'asthma', 'heart disease', 'cancer',
    'chronic', 'long-term', 'ongoing', 'persistent'
  ]
  if (chronicKeywords.some(keyword => 
    patientData.symptoms.toLowerCase().includes(keyword)
  )) {
    riskFactors.push('Chronic Condition')
    isHighRisk = true
  }

  // Post-op risk
  if (patientData.visitType === 'Post-op') {
    riskFactors.push('Post-operative')
    isHighRisk = true
  }

  // Emergency visit priority
  if (patientData.visitType === 'Emergency') {
    priority = 'Critical'
    isHighRisk = true
  }

  // High-risk symptoms
  const criticalSymptoms = [
    'chest pain', 'shortness of breath', 'severe bleeding',
    'unconscious', 'seizure', 'stroke', 'heart attack'
  ]
  if (criticalSymptoms.some(symptom => 
    patientData.symptoms.toLowerCase().includes(symptom)
  )) {
    priority = 'Critical'
    isHighRisk = true
    riskFactors.push('Critical Symptoms')
  }

  // Set priority based on risk factors
  if (isHighRisk && priority !== 'Critical') {
    priority = 'High'
  }

  return {
    isHighRisk,
    riskFactors,
    priority,
    riskScore: riskFactors.length
  }
}

// Generate unique patient ID
export function generatePatientId() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `KB-${timestamp}-${random}`
}

// Check-in new patient
export async function checkInPatient(patientData) {
  try {
    // Generate patient ID and assess risk
    const patientId = generatePatientId()
    const riskAssessment = assessPatientRisk(patientData)
    
    // Prepare patient record
    const patientRecord = {
      patient_id: patientId,
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      department: patientData.department,
      visit_type: patientData.visitType,
      symptoms: patientData.symptoms,
      is_high_risk: riskAssessment.isHighRisk,
      risk_factors: riskAssessment.riskFactors,
      priority: riskAssessment.priority,
      check_in_time: new Date().toISOString(),
      status: 'waiting',
      queue_position: 0, // Will be set by queue management
      notes: patientData.notes || ''
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('patients')
      .insert(patientRecord)
      .select()
      .single()

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    // Log to blockchain (mock)
    const blockchainResult = await logPatientCheckIn({
      patientId,
      name: patientData.name,
      department: patientData.department,
      visitType: patientData.visitType,
      riskFactors: riskAssessment.riskFactors
    })

    console.log(`[BLOCKCHAIN] Check-in logged: ${blockchainResult.transactionId}`)

    // Update queue position
    await updateQueuePosition(patientId, data.id, patientData.department)

    return {
      success: true,
      patient: data,
      blockchain: blockchainResult,
      riskAssessment
    }

  } catch (error) {
    console.error('Patient check-in error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Update queue position for new patient
async function updateQueuePosition(patientId, dbId, department) {
  try {
    // Get current queue for the department
    const { data: existingPatients } = await supabase
      .from('patients')
      .select('id, queue_position')
      .eq('department', department)
      .eq('status', 'waiting')
      .order('check_in_time', { ascending: true })

    // Calculate new position
    const newPosition = existingPatients.length + 1

    // Update patient's queue position
    const { error } = await supabase
      .from('patients')
      .update({ queue_position: newPosition })
      .eq('id', dbId)

    if (error) {
      console.error('Queue position update error:', error)
    }

  } catch (error) {
    console.error('Queue position calculation error:', error)
  }
}

// Get patients by department
export async function getPatientsByDepartment(department, status = 'waiting') {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('department', department)
      .eq('status', status)
      .order('queue_position', { ascending: true })
      .order('check_in_time', { ascending: true })

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    return {
      success: true,
      patients: data || []
    }

  } catch (error) {
    console.error('Get patients error:', error)
    return {
      success: false,
      error: error.message,
      patients: []
    }
  }
}

// Get all waiting patients
export async function getAllWaitingPatients() {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'waiting')
      .order('priority', { ascending: false })
      .order('check_in_time', { ascending: true })

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    return {
      success: true,
      patients: data || []
    }

  } catch (error) {
    console.error('Get all patients error:', error)
    return {
      success: false,
      error: error.message,
      patients: []
    }
  }
}

// Update patient status
export async function updatePatientStatus(patientId, newStatus, doctorId = null, notes = '') {
  try {
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString()
    }

    if (notes) {
      updateData.notes = notes
    }

    const { data, error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('patient_id', patientId)
      .select()
      .single()

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    // Log status update to blockchain
    if (data.status !== newStatus) {
      await logPatientStatusUpdate(patientId, data.status, newStatus, doctorId)
    }

    return {
      success: true,
      patient: data
    }

  } catch (error) {
    console.error('Update patient status error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get patient by ID
export async function getPatientById(patientId) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('patient_id', patientId)
      .single()

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    return {
      success: true,
      patient: data
    }

  } catch (error) {
    console.error('Get patient error:', error)
    return {
      success: false,
      error: error.message,
      patient: null
    }
  }
}

// Search patients
export async function searchPatients(query, filters = {}) {
  try {
    let queryBuilder = supabase
      .from('patients')
      .select('*')

    // Apply filters
    if (filters.department) {
      queryBuilder = queryBuilder.eq('department', filters.department)
    }
    if (filters.status) {
      queryBuilder = queryBuilder.eq('status', filters.status)
    }
    if (filters.isHighRisk !== undefined) {
      queryBuilder = queryBuilder.eq('is_high_risk', filters.isHighRisk)
    }
    if (filters.priority) {
      queryBuilder = queryBuilder.eq('priority', filters.priority)
    }

    // Apply search query
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,symptoms.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder
      .order('check_in_time', { ascending: false })
      .limit(50)

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    return {
      success: true,
      patients: data || []
    }

  } catch (error) {
    console.error('Search patients error:', error)
    return {
      success: false,
      error: error.message,
      patients: []
    }
  }
}

// Get department statistics
export async function getDepartmentStats(department = null) {
  try {
    let queryBuilder = supabase
      .from('patients')
      .select('status, priority, is_high_risk, department')

    if (department) {
      queryBuilder = queryBuilder.eq('department', department)
    }

    const { data, error } = await queryBuilder

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    // Calculate statistics
    const stats = {
      total: data.length,
      waiting: data.filter(p => p.status === 'waiting').length,
      inProgress: data.filter(p => p.status === 'in-progress').length,
      completed: data.filter(p => p.status === 'completed').length,
      highRisk: data.filter(p => p.is_high_risk).length,
      critical: data.filter(p => p.priority === 'Critical').length,
      high: data.filter(p => p.priority === 'High').length,
      normal: data.filter(p => p.priority === 'Normal').length
    }

    return {
      success: true,
      stats
    }

  } catch (error) {
    console.error('Get department stats error:', error)
    return {
      success: false,
      error: error.message,
      stats: {}
    }
  }
}
