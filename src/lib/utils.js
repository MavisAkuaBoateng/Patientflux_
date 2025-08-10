import { v4 as uuidv4 } from 'uuid'

// Generate unique patient ID with timestamp
export function generatePatientId() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `KB-${timestamp}-${random}`
}

// Korle-Bu Hospital Departments
export const HOSPITAL_DEPARTMENTS = [
  'Accident & Emergency',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Medicine',
  'General Surgery',
  'Gynecology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology'
]

// Visit Types
export const VISIT_TYPES = [
  'New Patient',
  'Follow-up',
  'Post-operative',
  'Emergency'
]

// Risk categorization rules
export function categorizeRisk(patient) {
  const { age, gender, visitType, symptoms } = patient
  let riskFactors = []
  
  // Elderly patients (>60)
  if (age > 60) {
    riskFactors.push('Elderly')
  }
  
  // Pregnant patients
  if (gender === 'Female' && symptoms?.toLowerCase().includes('pregnant')) {
    riskFactors.push('Pregnant')
  }
  
  // Chronic conditions (keywords in symptoms)
  const chronicKeywords = ['diabetes', 'hypertension', 'asthma', 'heart', 'cancer', 'chronic']
  const hasChronicCondition = chronicKeywords.some(keyword => 
    symptoms?.toLowerCase().includes(keyword)
  )
  if (hasChronicCondition) {
    riskFactors.push('Chronic Condition')
  }
  
  // Post-operative patients
  if (visitType === 'Post-operative') {
    riskFactors.push('Post-operative')
  }
  
  // Emergency visits
  if (visitType === 'Emergency') {
    riskFactors.push('Emergency')
  }
  
  return {
    isHighRisk: riskFactors.length > 0,
    riskFactors,
    priority: riskFactors.length > 2 ? 'Critical' : riskFactors.length > 0 ? 'High' : 'Normal'
  }
}

// Format queue position
export function formatQueuePosition(position) {
  if (position === 1) return '1st'
  if (position === 2) return '2nd'
  if (position === 3) return '3rd'
  return `${position}th`
}

// Format timestamp for display
export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-GH', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Generate QR code data for patient
export function generateQRData(patientId) {
  return JSON.stringify({
    patientId,
    timestamp: Date.now(),
    hospital: process.env.NEXT_PUBLIC_HOSPITAL_NAME
  })
}

// Mock Hyperledger Fabric transaction
export function mockFabricTransaction(patientData) {
  return {
    transactionId: uuidv4(),
    timestamp: new Date().toISOString(),
    patientId: patientData.patientId,
    action: 'PATIENT_CHECKIN',
    data: {
      name: patientData.name,
      department: patientData.department,
      visitType: patientData.visitType,
      riskLevel: patientData.riskLevel
    },
    status: 'COMMITTED',
    blockNumber: Math.floor(Math.random() * 10000)
  }
} 