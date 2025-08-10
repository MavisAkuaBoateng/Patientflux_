'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Clock, User, Building2, AlertTriangle, CheckCircle, Play, Pause, Square } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-hot-toast'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default function QueueDisplay({ userRole = 'receptionist', department = null, onPatientSelect = null }) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(department)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Hospital departments for filtering
  const departments = [
    'All Departments',
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

  useEffect(() => {
    if (autoRefresh) {
      fetchPatients()
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('patients_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'patients' 
          }, 
          (payload) => {
            console.log('Real-time update:', payload)
            fetchPatients() // Refresh data on any change
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [selectedDepartment, autoRefresh])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('patients')
        .select('*')
        .eq('status', 'waiting')
        .order('priority', { ascending: false })
        .order('check_in_time', { ascending: true })

      if (selectedDepartment && selectedDepartment !== 'All Departments') {
        query = query.eq('department', selectedDepartment)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setPatients(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updatePatientStatus = async (patientId, newStatus) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('patient_id', patientId)

      if (error) {
        throw error
      }

      toast.success(`Patient status updated to ${newStatus}`)
    } catch (err) {
      console.error('Error updating patient status:', err)
      toast.error('Failed to update patient status')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="w-4 h-4" />
      case 'High': return <AlertTriangle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading queue...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading queue: {error}</p>
        <button 
          onClick={fetchPatients}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Patient Queue</h1>
              <p className="text-green-100 mt-2">
                {selectedDepartment && selectedDepartment !== 'All Departments' 
                  ? `${selectedDepartment} Department` 
                  : 'All Departments'} - Real-time Updates
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  autoRefresh 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {autoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{autoRefresh ? 'Live' : 'Paused'}</span>
              </button>
              <button
                onClick={fetchPatients}
                className="px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700">Department:</span>
            <select
              value={selectedDepartment || 'All Departments'}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'All Departments' ? null : dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>
          
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{patients.length}</span> patients waiting
          </div>
        </div>
      </div>

      {/* Queue Display */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {patients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No patients in queue</h3>
            <p>All patients have been attended to or the queue is empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Queue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visit Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wait Time
                  </th>
                  {userRole === 'doctor' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                                        {patients.map((patient, index) => (
                          <tr 
                            key={patient.id} 
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => onPatientSelect && onPatientSelect(patient)}
                          >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto">
                          {patient.queue_position || index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {patient.patient_id} • Age: {patient.age} • {patient.gender}
                          </div>
                          {patient.is_high_risk && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              High Risk
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{patient.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{patient.visit_type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                        {getPriorityIcon(patient.priority)}
                        <span className="ml-1">{patient.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(patient.check_in_time), { addSuffix: true })}
                    </td>
                    {userRole === 'doctor' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updatePatientStatus(patient.patient_id, 'in-progress')}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => updatePatientStatus(patient.patient_id, 'completed')}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50"
                          >
                            Complete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
          <div className="text-sm text-gray-600">Total Waiting</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {patients.filter(p => p.priority === 'Critical').length}
          </div>
          <div className="text-sm text-gray-600">Critical Priority</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {patients.filter(p => p.priority === 'High').length}
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {patients.filter(p => p.is_high_risk).length}
          </div>
          <div className="text-sm text-gray-600">High Risk</div>
        </div>
      </div>
    </div>
  )
}
