'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { User, Calendar, Users, Building2, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import { checkInPatient, HOSPITAL_DEPARTMENTS, VISIT_TYPES } from '../lib/patients'

export default function CheckInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkInResult, setCheckInResult] = useState(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm()

  const watchVisitType = watch('visitType')
  const watchSymptoms = watch('symptoms')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setCheckInResult(null)

    try {
      const result = await checkInPatient({
        name: data.name,
        age: parseInt(data.age),
        gender: data.gender,
        department: data.department,
        visitType: data.visitType,
        symptoms: data.symptoms,
        notes: data.notes || ''
      })

      if (result.success) {
        setCheckInResult(result)
        toast.success('Patient checked in successfully!')
        reset()
      } else {
        toast.error(`Check-in failed: ${result.error}`)
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="w-4 h-4" />
      case 'High': return <AlertTriangle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
          <h1 className="text-3xl font-bold">Patient Check-In</h1>
          <p className="text-blue-100 mt-2">Korle-Bu Teaching Hospital - OPD Registration</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter patient's full name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Age *
                </label>
                <input
                  type="number"
                  {...register('age', { 
                    required: 'Age is required',
                    min: { value: 0, message: 'Age must be positive' },
                    max: { value: 150, message: 'Age must be realistic' }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter age"
                />
                {errors.age && (
                  <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
                )}
              </div>
            </div>

            {/* Gender and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Gender *
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Department *
                </label>
                <select
                  {...register('department', { required: 'Department is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Select department</option>
                  {HOSPITAL_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>
                )}
              </div>
            </div>

            {/* Visit Type and Symptoms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Visit Type *
                </label>
                <select
                  {...register('visitType', { required: 'Visit type is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Select visit type</option>
                  {VISIT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.visitType && (
                  <p className="text-red-600 text-sm mt-1">{errors.visitType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  High-Risk Flag
                </label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="yes"
                      {...register('highRisk')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="no"
                      {...register('highRisk')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Symptoms & Complaints *
              </label>
              <textarea
                {...register('symptoms', { required: 'Symptoms are required' })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Describe patient's symptoms, complaints, or reason for visit..."
              />
              {errors.symptoms && (
                <p className="text-red-600 text-sm mt-1">{errors.symptoms.message}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Any additional information, allergies, medications, etc..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Check-In...
                  </>
                ) : (
                  'Complete Check-In'
                )}
              </button>
            </div>
          </form>

          {/* Check-in Result */}
          {checkInResult && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-800">Check-in Successful!</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-700"><strong>Patient ID:</strong> {checkInResult.patient.patient_id}</p>
                  <p className="text-green-700"><strong>Name:</strong> {checkInResult.patient.name}</p>
                  <p className="text-green-700"><strong>Department:</strong> {checkInResult.patient.department}</p>
                </div>
                <div>
                  <p className="text-green-700"><strong>Priority:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(checkInResult.patient.priority)}`}>
                      {getPriorityIcon(checkInResult.patient.priority)}
                      <span className="ml-1">{checkInResult.patient.priority}</span>
                    </span>
                  </p>
                  <p className="text-green-700"><strong>Risk Level:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${checkInResult.patient.is_high_risk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {checkInResult.patient.is_high_risk ? 'High Risk' : 'Low Risk'}
                    </span>
                  </p>
                  <p className="text-green-700"><strong>Queue Position:</strong> {checkInResult.patient.queue_position}</p>
                </div>
              </div>

              {checkInResult.blockchain && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-700 text-sm">
                    <strong>Blockchain:</strong> Transaction {checkInResult.blockchain.transactionId} committed to ledger
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
