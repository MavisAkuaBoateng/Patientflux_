'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return true
      }
      
      // Check for iOS PWA installation
      if (window.navigator.standalone === true) {
        setIsInstalled(true)
        return true
      }
      
      return false
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      console.log('🎉 PWA was installed successfully!')
    }

    // Check installation status on mount
    checkIfInstalled()

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt')
        setShowInstallPrompt(false)
        setDeferredPrompt(null)
      } else {
        console.log('❌ User dismissed the install prompt')
      }
    } catch (error) {
      console.error('❌ Error during PWA installation:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install PatientFlux
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Get quick access to patient management on your device
            </p>
            
            {/* Install Button */}
            <button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Platform-specific instructions */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Monitor className="w-3 h-3" />
            <span>
              {navigator.userAgent.includes('Chrome') 
                ? 'Click "Install" in the address bar'
                : navigator.userAgent.includes('Safari')
                ? 'Tap Share → Add to Home Screen'
                : 'Use your browser\'s install option'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
