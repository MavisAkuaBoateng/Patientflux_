import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'
import { generatePatientId, categorizeRisk, mockFabricTransaction } from '../../../lib/utils'

// GET /api/patients - Get all patients
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const priority = searchParams.get('priority')
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('patients')
      .select('*')
      .order('checkInTime', { ascending: false })

    if (department && department !== 'all') {
      query = query.eq('department', department)
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
    }

    return NextResponse.json({ patients: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/patients - Create new patient
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      name,
      age,
      gender,
      department,
      visitType,
      symptoms
    } = body

    // Validate required fields
    if (!name || !age || !gender || !department || !visitType || !symptoms) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate patient ID and assess risk
    const patientId = generatePatientId()
    const riskAssessment = categorizeRisk({ age, gender, visitType, symptoms })

    const patientData = {
      patientId,
      name,
      age: parseInt(age),
      gender,
      department,
      visitType,
      symptoms,
      ...riskAssessment,
      checkInTime: new Date().toISOString(),
      status: 'waiting',
      queuePosition: 1 // Will be calculated based on existing queue
    }

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('patients')
      .insert([patientData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
    }

    // Mock blockchain transaction
    const fabricTransaction = mockFabricTransaction(patientData)
    
    // Log blockchain transaction (mock)
    await supabaseAdmin
      .from('ledger_logs')
      .insert([fabricTransaction])

    return NextResponse.json({ 
      patient: data[0],
      transaction: fabricTransaction
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/patients/[id] - Update patient status
export async function PUT(request) {
  try {
    const body = await request.json()
    const { patientId, status, notes } = body

    if (!patientId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updateData = { status }
    if (notes) {
      updateData.notes = notes
    }

    const { data, error } = await supabaseAdmin
      .from('patients')
      .update(updateData)
      .eq('patientId', patientId)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 })
    }

    return NextResponse.json({ patient: data[0] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 