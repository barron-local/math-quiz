import { useState, useEffect, useCallback, useRef } from 'react'

export interface AppUpdateState {
  hasUpdate: boolean
  isUpdating: boolean
  dismissed: boolean
  applyUpdate: (beforeReload?: () => void) => void
  dismissUpdate: () => void
  checkNow: () => Promise<void>
}

// Current build version timestamp injected at compile time
const CURRENT_BUILD = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : ''

export function useAppUpdate(): AppUpdateState {
  const [hasUpdate, setHasUpdate] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const waitingWorkerRef = useRef<ServiceWorker | null>(null)
  const isCheckingRef = useRef(false)

  // Realtime version check function (only queries when tab is visible to conserve Vercel quota)
  const checkVersion = useCallback(async (force = false) => {
    if (isCheckingRef.current || typeof window === 'undefined') return
    if (!force && document.visibilityState !== 'visible') return
    isCheckingRef.current = true

    try {
      // 1. Check Service Worker for new pending worker
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.getRegistration()
          if (reg) {
            // Trigger background SW update check
            await reg.update().catch(() => {})
            if (reg.waiting) {
              waitingWorkerRef.current = reg.waiting
              setHasUpdate(true)
            }
          }
        } catch {
          // Ignore SW errors in dev / unsupported environments
        }
      }

      // 2. Realtime fetch to /version.json with cache-busting
      if (CURRENT_BUILD) {
        const response = await fetch(`/version.json?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        })

        if (response.ok) {
          const remote = await response.json()
          if (remote?.version && remote.version !== CURRENT_BUILD) {
            setHasUpdate(true)
          }
        }
      }
    } catch (err) {
      // Network hiccup or offline - fail silently
    } finally {
      isCheckingRef.current = false
    }
  }, [])

  // Listen to Service Worker lifecycle events
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return

      if (reg.waiting) {
        waitingWorkerRef.current = reg.waiting
        setHasUpdate(true)
      }

      reg.addEventListener('updatefound', () => {
        const installing = reg.installing
        if (!installing) return

        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            waitingWorkerRef.current = installing
            setHasUpdate(true)
          }
        })
      })
    })

    // Listen for controlling service worker change
    let refreshing = false
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    }
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  // Setup periodic realtime polling (every 12 seconds) & window event triggers
  useEffect(() => {
    // Initial check on mount
    checkVersion()

    // 15-second active heartbeat polling while tab is visible (near-instant realtime detection)
    const interval = setInterval(() => checkVersion(false), 15000)

    // Check instantly when tab becomes visible or receives focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkVersion(true)
      }
    }

    const handleFocus = () => {
      checkVersion(true)
    }

    const handleOnline = () => {
      checkVersion(true)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('online', handleOnline)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('online', handleOnline)
    }
  }, [checkVersion])

  const applyUpdate = useCallback((beforeReload?: () => void) => {
    setIsUpdating(true)

    // Execute session auto-save before reloading
    if (beforeReload) {
      try {
        beforeReload()
      } catch (err) {
        console.warn('Error during pre-reload callback:', err)
      }
    }

    // Tell waiting Service Worker to take over immediately
    if (waitingWorkerRef.current) {
      waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' })
    }

    // Reload with slight delay to ensure storage write commits
    setTimeout(() => {
      window.location.reload()
    }, 120)
  }, [])

  const dismissUpdate = useCallback(() => {
    setDismissed(true)
  }, [])

  return {
    hasUpdate,
    isUpdating,
    dismissed,
    applyUpdate,
    dismissUpdate,
    checkNow: checkVersion,
  }
}
