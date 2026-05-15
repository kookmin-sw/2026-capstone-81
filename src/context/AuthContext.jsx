import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth'

const AuthContext = createContext(null)

// Mobile / in-app browsers block popups; use redirect there.
function shouldUseRedirect() {
  if (typeof window === 'undefined' || !window.navigator) return false
  const ua = window.navigator.userAgent || ''
  // Mobile devices, in-app browsers, and small screens
  return (
    /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    /FBAN|FBAV|Instagram|Line|KAKAOTALK|wv/i.test(ua) ||  // in-app browsers (Facebook, Instagram, Line, KakaoTalk, WebView)
    (window.matchMedia && window.matchMedia('(max-width: 768px)').matches)
  )
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    // Handle the redirect-back from Google after signInWithRedirect.
    // Has no effect on normal page loads.
    getRedirectResult(auth).catch((err) => {
      console.error('[Auth] getRedirectResult failed:', err)
    })

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    // Pick the flow the current device can actually handle.
    if (shouldUseRedirect()) {
      // Redirect flow: navigates the page to Google, comes back via getRedirectResult.
      return signInWithRedirect(auth, provider)
    }
    try {
      return await signInWithPopup(auth, provider)
    } catch (err) {
      // Common failures where popup is blocked → fall back to redirect.
      if (
        err?.code === 'auth/popup-blocked' ||
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        console.warn('[Auth] popup failed, falling back to redirect:', err.code)
        return signInWithRedirect(auth, provider)
      }
      throw err
    }
  }

  const logout = () => {
    return signOut(auth)
  }

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
