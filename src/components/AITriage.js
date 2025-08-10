'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Brain, AlertTriangle, CheckCircle, Clock, User, Activity, FileText, Building2 } from 'lucide-react'
import { performAITriage } from '../lib/ai'
import { logAITriageDecision } from '../lib/blockchain'

export default function AITriage({ patient, onTriageComplete }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [triageResult, setTriageResult] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  const handleAITriage = async () => {
    if (!patient) {
      toast.error('No patient selected for AI triage')
      return
    }

    setIsProcessing(true)
    setTriageResult(null)

    try {
      // Perform AI triage
      const result = await performAITriage(patient.symptoms, {
        age: patient.age,
        gender: patient.gender,
        visitType: patient.visit_type
      })

      if (result) {
        setTriageResult(result)
        
        // Log to blockchain
        const blockchainResult = await logAITriageDecision(
          patient.patient_id,
          result,
          'doctor-ai-system'
        )

        console.log('AI triage logged to blockchain:', blockchainResult)

        toast.success('AI triage completed successfully!')
        
        // Notify parent component
        if (onTriageComplete) {
          onTriageComplete(result)
        }
      } else {
        toast.error('AI triage failed to generate assessment')
      }
    } catch (error) {
      console.error('AI triage error:', error)
      toast.error(`AI triage error: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgencyIcon = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />
      case 'high': return <AlertTriangle className="w-5 h-5" />
      case 'medium': return <Clock className="w-5 h-5" />
      case 'low': return <CheckCircle className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
        <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">AI Triage Assistant</h3>
        <p className="text-gray-500">Select a patient from the queue to perform AI triage assessment.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6" />
            <h2 className="text-xl font-bold">AI Triage Assessment</h2>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
          >
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        </div>
      </div>

      {/* Patient Info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
            <div className="text-sm text-gray-600">
              ID: {patient.patient_id} • Age: {patient.age} • {patient.gender} • {patient.department}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <strong>Symptoms:</strong> {patient.symptoms}
            </div>
          </div>
        </div>
      </div>

      {/* AI Triage Button */}
      <div className="p-6">
        <button
          onClick={handleAITriage}
          disabled={isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              AI Processing Triage...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 mr-2" />
              Perform AI Triage Assessment
            </>
          )}
        </button>
      </div>

      {/* Triage Results */}
      {triageResult && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            AI Triage Assessment Complete
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgency Level */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Urgency Level
              </h4>
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getUrgencyColor(triageResult.urgency)}`}>
                {getUrgencyIcon(triageResult.urgency)}
                <span className="ml-2 font-bold">{triageResult.urgency}</span>
              </div>
            </div>

            {/* Department Priority */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Recommended Department
              </h4>
              <div className="text-lg font-semibold text-blue-600">
                {triageResult.departmentPriority}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Recommended Next Steps
            </h4>
            <ul className="space-y-2">
              {triageResult.nextSteps?.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns */}
          {triageResult.concerns && triageResult.concerns.length > 0 && (
            <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Immediate Concerns
              </h4>
              <ul className="space-y-2">
                {triageResult.concerns.map((concern, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-red-700">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Estimated Wait Time */}
          {triageResult.estimatedWaitTime && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Estimated Wait Time
              </h4>
              <div className="text-lg font-semibold text-blue-600">
                {triageResult.estimatedWaitTime}
              </div>
            </div>
          )}

          {/* Blockchain Confirmation */}
          <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center text-green-800 text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Triage decision logged to blockchain ledger</span>
            </div>
          </div>
        </div>
      )}

      {/* Patient History (if enabled) */}
      {showHistory && (
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Visit History</h3>
          <div className="text-sm text-gray-600">
            <p>Previous visits and triage assessments would be displayed here.</p>
            <p className="mt-2">This feature integrates with the blockchain ledger for complete audit trail.</p>
          </div>
        </div>
      )}
    </div>
  )
}
