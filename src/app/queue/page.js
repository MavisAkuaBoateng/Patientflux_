'use client'

import QueueDisplay from '../../components/QueueDisplay'

export default function QueuePage() {
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
              <a href="/doctor-dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Doctor</a>
              <a href="/admin-dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Admin</a>
            </div>
          </div>
        </div>
      </div>

      <QueueDisplay userRole="receptionist" />
    </div>
  )
} 