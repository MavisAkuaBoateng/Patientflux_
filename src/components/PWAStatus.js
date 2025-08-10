'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, RefreshCw, Settings, CheckCircle, AlertCircle } from 'lucide-react'

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isStandalone, setIsStandalone] = useState(false)
  const [swStatus, setSwStatus] = useState('unknown')
  const [cacheSize, setCacheSize] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Check PWA status
    const checkPWAStatus = () => {
      // Check if running in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsStandalone(true)
      }

      // Check service worker status
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          if (registration.active) {
            setSwStatus('active')
            // Get cache size
            getCacheSize()
          } else if (registration.installing) {
            setSwStatus('installing')
          } else if (registration.waiting) {
            setSwStatus('waiting')
          } else {
            setSwStatus('inactive')
          }
        }).catch(() => {
          setSwStatus('error')
        })
      } else {
        setSwStatus('unsupported')
      }
    }

    // Get cache storage size
    const getCacheSize = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys()
          let totalSize = 0
          
          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName)
            const keys = await cache.keys()
            
            for (const request of keys) {
              const response = await cache.match(request)
              if (response) {
                const blob = await response.blob()
                totalSize += blob.size
              }
            }
          }
          
          setCacheSize(Math.round(totalSize / (1024 * 1024) * 100) / 100) // MB
        } catch (error) {
          console.error('Error calculating cache size:', error)
        }
      }
    }

    // Initial checks
    updateOnlineStatus()
    checkPWAStatus()

    // Event listeners
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'BACKGROUND_SYNC_COMPLETE') {
          console.log('Background sync completed')
        }
      })
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const handleRefresh = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update()
      })
    }
    window.location.reload()
  }

  const handleClearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
        setCacheSize(0)
        console.log('Cache cleared successfully')
      } catch (error) {
        console.error('Error clearing cache:', error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'installing': return 'text-yellow-600'
      case 'waiting': return 'text-orange-600'
      case 'inactive': return 'text-red-600'
      case 'error': return 'text-red-600'
      case 'unsupported': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'installing': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'waiting': return <AlertCircle className="w-4 h-4" />
      case 'inactive': return <AlertCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      case 'unsupported': return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'installing': return 'Installing'
      case 'waiting': return 'Waiting'
      case 'inactive': return 'Inactive'
      case 'error': return 'Error'
      case 'unsupported': return 'Unsupported'
      default: return 'Unknown'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">PWA Status</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center space-x-3 mb-4">
        {isOnline ? (
          <Wifi className="w-5 h-5 text-green-600" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-600" />
        )}
        <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        {isStandalone && (
          <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            PWA Mode
          </span>
        )}
      </div>

      {/* Service Worker Status */}
      <div className="flex items-center space-x-3 mb-4">
        <div className={`${getStatusColor(swStatus)}`}>
          {getStatusIcon(swStatus)}
        </div>
        <span className={`text-sm font-medium ${getStatusColor(swStatus)}`}>
          Service Worker: {getStatusText(swStatus)}
        </span>
      </div>

      {/* Cache Info */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">Cache Size:</span>
        <span className="text-sm font-medium text-gray-900">{cacheSize} MB</span>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={handleRefresh}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
        <button
          onClick={handleClearCache}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
        >
          Clear Cache
        </button>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Technical Details</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>User Agent:</span>
              <span className="font-mono">{navigator.userAgent.substring(0, 50)}...</span>
            </div>
            <div className="flex justify-between">
              <span>Platform:</span>
              <span>{navigator.platform}</span>
            </div>
            <div className="flex justify-between">
              <span>Language:</span>
              <span>{navigator.language}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Worker:</span>
              <span>{'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}</span>
            </div>
            <div className="flex justify-between">
              <span>Cache Storage:</span>
              <span>{'caches' in window ? 'Supported' : 'Not Supported'}</span>
            </div>
            <div className="flex justify-between">
              <span>Push Manager:</span>
              <span>{'PushManager' in window ? 'Supported' : 'Not Supported'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
