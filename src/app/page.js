'use client'

import Link from 'next/link'
import { 
  UserPlus, 
  Users, 
  Stethoscope, 
  Shield, 
  Building2,
  Activity,
  Database,
  Brain
} from 'lucide-react'
import PWAInstall from '../components/PWAInstall'

export default function HomePage() {
  const features = [
    {
      icon: UserPlus,
      title: 'Patient Check-In',
      description: 'Streamlined patient registration with risk assessment and QR code generation',
      href: '/checkin',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Queue Management',
      description: 'Real-time patient queue monitoring with department filtering and priority sorting',
      href: '/queue',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Stethoscope,
      title: 'Doctor Dashboard',
      description: 'Patient management interface with AI-powered triage assessment',
      href: '/doctor-dashboard',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Admin Dashboard',
      description: 'Hospital analytics, natural language queries, and blockchain monitoring',
      href: '/admin-dashboard',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const highlights = [
    {
      icon: Brain,
      title: 'AI-Powered Triage',
      description: 'Intelligent patient assessment using advanced language models'
    },
    {
      icon: Database,
      title: 'Blockchain Security',
      description: 'Immutable audit trail for all patient interactions and decisions'
    },
    {
      icon: Activity,
      title: 'Real-time Updates',
      description: 'Live queue updates and instant notifications across the system'
    },
    {
      icon: Building2,
      title: 'Department Management',
      description: 'Specialized workflows for different medical departments'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              PatientFlux
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Cloud-native hospital OPD scheduling and patient-flow management platform 
              for Korle-Bu Teaching Hospital. Streamline operations with AI-powered triage, 
              real-time queue management, and blockchain security.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/checkin"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Start Check-In
              </Link>
              <Link 
                href="/queue"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center"
              >
                <Users className="w-5 h-5 mr-2" />
                View Queue
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Hospital Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage patient flow, from check-in to discharge
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technology for modern healthcare management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <highlight.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstall />
    </div>
  )
}
