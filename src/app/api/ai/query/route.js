import { NextResponse } from 'next/server'
import { processNaturalLanguageQuery } from '../../../../lib/ai'

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

    // Process natural language query
    const queryResult = await processNaturalLanguageQuery(query, context || {})

    return NextResponse.json({ 
      result: queryResult,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI Query API error:', error)
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
} 