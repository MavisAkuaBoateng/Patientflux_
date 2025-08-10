'use client'

import { useState } from 'react'
import QueueDisplay from '../../components/QueueDisplay'
import AITriage from '../../components/AITriage'

export default function DoctorDashboardPage() {
  const [selectedPatient, setSelectedPatient] = useState(null)

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
  }

  const handleTriageComplete = (triageResult) => {
    console.log('Triage completed:', triageResult)
    // Could trigger queue refresh or other actions
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">PatientFlux</span>
              </div>
              <span className="text-sm text-gray-500">Korle-Bu Teaching Hospital</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="/checkin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Check-In</a>
              <a href="/queue" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Queue</a>
              <a href="/admin-dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Admin</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-blue-100 mt-2">
              Patient queue management and AI triage assessment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Queue - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <QueueDisplay 
              userRole="doctor" 
              onPatientSelect={handlePatientSelect}
            />
          </div>

          {/* AI Triage Panel - Takes 1/3 of the width */}
          <div className="lg:col-span-1">
            <AITriage 
              patient={selectedPatient}
              onTriageComplete={handleTriageComplete}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 