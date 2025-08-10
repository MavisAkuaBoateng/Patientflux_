import { NextResponse } from 'next/server'
import { performAITriage } from '../../../../lib/ai'

// POST /api/ai/triage - Perform AI triage
export async function POST(request) {
  try {
    const body = await request.json()
    const { symptoms, patientInfo } = body

    if (!symptoms || !patientInfo) {
      return NextResponse.json(
        { error: 'Missing required fields: symptoms and patientInfo' },
        { status: 400 }
      )
    }

    // Perform AI triage
    const triageResult = await performAITriage(symptoms, patientInfo)

    return NextResponse.json({ 
      triage: triageResult,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI Triage API error:', error)
    return NextResponse.json(
      { error: 'Failed to perform AI triage' },
      { status: 500 }
    )
  }
} 