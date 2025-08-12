'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { 
  BarChart3, 
  Users, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Activity,
  Search,
  Database,
  Shield,
  TrendingUp,
  User,
  Calendar
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalPatients: 0,
    waitingPatients: 0,
    criticalPatients: 0,
    highRiskPatients: 0,
    avgWaitTime: '0 min',
    departmentStats: []
  })

  // Mock analytics data
  useEffect(() => {
    setAnalytics({
      totalPatients: 156,
      waitingPatients: 23,
      criticalPatients: 5,
      highRiskPatients: 12,
      avgWaitTime: '45 min',
      departmentStats: [
        { department: 'Emergency Medicine', patients: 8, avgWait: '15 min' },
        { department: 'Cardiology', patients: 6, avgWait: '52 min' },
        { department: 'General Medicine', patients: 4, avgWait: '38 min' },
        { department: 'Pediatrics', patients: 3, avgWait: '41 min' },
        { department: 'Orthopedics', patients: 2, avgWait: '67 min' }
      ]
    })
  }, [])

  const handleQuerySubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsProcessing(true)
    setQueryResult(null)

    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to process query')
      }

      const result = await response.json()
      setQueryResult(result)
      
      if (result.resultType === 'error') {
        toast.error(result.interpretation)
      } else {
        toast.success('Query processed successfully!')
      }
    } catch (error) {
      console.error('Query processing error:', error)
      toast.error('Failed to process query. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
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
              <a href="/doctor-dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Doctor</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-indigo-100 mt-2">
              Hospital operations overview and blockchain monitoring
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Takes 2/3 of the width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Natural Language Query Interface */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <Search className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Natural Language Query</h2>
              </div>
              
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ask about hospital operations, patient data, or blockchain records
                  </label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., 'Show me all critical patients in Cardiology department' or 'What's the average wait time today?'"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing || !query.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Process Query
                    </>
                  )}
                </button>
              </form>

              {/* Query Results */}
              {queryResult && (
                <div className="mt-6 space-y-4">
                  {/* Query Interpretation */}
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <h3 className="font-semibold text-indigo-900 mb-2">Query Interpretation:</h3>
                    <p className="text-indigo-800">{queryResult.interpretation}</p>
                  </div>

                  {/* Filters Applied */}
                  {queryResult.filters && Object.keys(queryResult.filters).length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Filters Applied:</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(queryResult.filters).map(([key, value]) => (
                          <span key={key} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {key}: {value.toString()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analytics Results */}
                  {queryResult.resultType === 'analytics' && queryResult.data && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-4">Analytics Results:</h3>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {queryResult.data.avgWaitTime && (
                          <div className="text-center p-3 bg-purple-100 rounded-lg">
                            <div className="text-xl font-bold text-purple-600">{queryResult.data.avgWaitTime}</div>
                            <div className="text-sm text-purple-800">Average Wait Time</div>
                          </div>
                        )}
                        {queryResult.data.totalPatients !== undefined && (
                          <div className="text-center p-3 bg-blue-100 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">{queryResult.data.totalPatients}</div>
                            <div className="text-sm text-blue-800">Total Patients</div>
                          </div>
                        )}
                        {queryResult.data.waitingPatients !== undefined && (
                          <div className="text-center p-3 bg-yellow-100 rounded-lg">
                            <div className="text-xl font-bold text-yellow-600">{queryResult.data.waitingPatients}</div>
                            <div className="text-sm text-yellow-800">Waiting Patients</div>
                          </div>
                        )}
                        {queryResult.data.criticalPatients !== undefined && (
                          <div className="text-center p-3 bg-red-100 rounded-lg">
                            <div className="text-xl font-bold text-red-600">{queryResult.data.criticalPatients}</div>
                            <div className="text-sm text-red-800">Critical Patients</div>
                          </div>
                        )}
                      </div>

                      {/* Priority Breakdown */}
                      {(queryResult.data.criticalPatients !== undefined || queryResult.data.highPriorityPatients !== undefined || queryResult.data.normalPatients !== undefined) && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-purple-900 mb-3">Priority Breakdown:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {queryResult.data.criticalPatients !== undefined && (
                              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <span className="text-red-800 font-medium">Critical</span>
                                <span className="text-red-600 font-bold">{queryResult.data.criticalPatients}</span>
                              </div>
                            )}
                            {queryResult.data.highPriorityPatients !== undefined && (
                              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <span className="text-orange-800 font-medium">High Priority</span>
                                <span className="text-orange-600 font-bold">{queryResult.data.highPriorityPatients}</span>
                              </div>
                            )}
                            {queryResult.data.normalPatients !== undefined && (
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <span className="text-green-800 font-medium">Normal</span>
                                <span className="text-green-600 font-bold">{queryResult.data.normalPatients}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Department Statistics */}
                      {queryResult.data.departmentStats && queryResult.data.departmentStats.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-3">Department Statistics:</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {queryResult.data.departmentStats.map((dept, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white border border-purple-200 rounded-lg">
                                <div className="flex items-center">
                                  <Building2 className="w-4 h-4 text-purple-400 mr-2" />
                                  <span className="font-medium text-purple-900">{dept.department}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-purple-700">
                                  <span>{dept.total} total</span>
                                  <span>{dept.waiting} waiting</span>
                                  <span>Avg: {dept.avgWait}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Patient Data */}
                  {queryResult.data && Array.isArray(queryResult.data) && queryResult.data.length > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-4">
                        Results ({queryResult.data.length} patients found):
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {queryResult.data.map((patient, index) => (
                          <div key={patient.id || index} className="bg-white p-3 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{patient.name}</div>
                                  <div className="text-sm text-gray-500">
                                    ID: {patient.patient_id} • Age: {patient.age} • {patient.gender}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(patient.priority)}`}>
                                  {patient.priority}
                                </span>
                                <span className="text-sm text-gray-500">{patient.department}</span>
                              </div>
                            </div>
                            {patient.is_high_risk && (
                              <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                High Risk
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error or No Results */}
                  {queryResult.resultType === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-2">Query Error:</h3>
                      <p className="text-red-800">{queryResult.interpretation}</p>
                    </div>
                  )}

                  {queryResult.data && Array.isArray(queryResult.data) && queryResult.data.length === 0 && queryResult.resultType !== 'error' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">No Results Found:</h3>
                      <p className="text-yellow-800">No patients match the specified criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Analytics Overview */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <BarChart3 className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Hospital Analytics</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalPatients}</div>
                  <div className="text-sm text-blue-800">Total Patients</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{analytics.waitingPatients}</div>
                  <div className="text-sm text-yellow-800">Waiting</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{analytics.criticalPatients}</div>
                  <div className="text-sm text-red-800">Critical</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{analytics.highRiskPatients}</div>
                  <div className="text-sm text-orange-800">High Risk</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Department Performance</h3>
                {analytics.departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-700">{dept.department}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{dept.patients} patients</span>
                      <span>Avg wait: {dept.avgWait}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Takes 1/3 of the width */}
          <div className="lg:col-span-1 space-y-6">
            {/* Blockchain Status */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Blockchain Status</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Network Status</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Block</span>
                  <span className="text-sm font-medium">#1,247</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Transactions</span>
                  <span className="text-sm font-medium">2,891</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Peers</span>
                  <span className="text-sm font-medium">4</span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <Activity className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Healthy
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Services</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Queue System</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="font-medium text-purple-900">Generate Report</div>
                  <div className="text-sm text-purple-700">Export patient data</div>
                </button>
                
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="font-medium text-blue-900">System Backup</div>
                  <div className="text-sm text-blue-700">Create backup</div>
                </button>
                
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="font-medium text-green-900">Audit Log</div>
                  <div className="text-sm text-green-700">View activity log</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 