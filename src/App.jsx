import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import UserBlogDetail from './pages/UserBlogDetail'
import WriteBlog from './pages/WriteBlog'
import AIChat from './pages/AIChat'
import SavedTrip from './pages/SavedTrip'

// Desktop pages
import DesktopLayout from './components/desktop/DesktopLayout'
import DesktopHome from './pages/desktop/DesktopHome'
import DesktopExplore from './pages/desktop/DesktopExplore'
import DesktopMap from './pages/desktop/DesktopMap'
import DesktopDetail from './pages/desktop/DesktopDetail'
import DesktopPlanner from './pages/desktop/DesktopPlanner'
import DesktopBlog from './pages/desktop/DesktopBlog'
import DesktopBlogDetail from './pages/desktop/DesktopBlogDetail'
import DesktopProfile from './pages/desktop/DesktopProfile'
import DesktopCulture from './pages/desktop/DesktopCulture'
import DesktopBudget from './pages/desktop/DesktopBudget'
import DesktopRestaurants from './pages/desktop/DesktopRestaurants'
import DesktopSaved from './pages/desktop/DesktopSaved'
import DesktopPacking from './pages/desktop/DesktopPacking'

// Mobile pages
import MobileHome from './pages/mobile/MobileHome'
import MobileExplore from './pages/mobile/MobileExplore'
import MobilePlanner from './pages/mobile/MobilePlanner'
import MobileMap from './pages/mobile/MobileMap'
import MobileProfile from './pages/mobile/MobileProfile'
import MobileBlog from './pages/mobile/MobileBlog'

// Shared pages (used in both mobile and desktop)
import { BlogDetail } from './pages/Blog'
import Culture from './pages/Culture'
import Budget from './pages/Budget'
import Restaurants from './pages/Restaurants'
import ExploreDetail from './pages/ExploreDetail'

const FORCE_MODE = import.meta.env.VITE_MODE // 'mobile' | 'desktop' | undefined

function detect() {
  if (FORCE_MODE === 'mobile') return true
  if (FORCE_MODE === 'desktop') return false
  // Capacitor native app → always mobile
  try { if (window.Capacitor?.isNativePlatform?.()) return true } catch {}
  return window.innerWidth < 768
}

function useIsMobile() {
  const [mobile, setMobile] = useState(detect)
  useEffect(() => {
    const handler = () => setMobile(detect())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}

function DesktopApp() {
  return (
    <DesktopLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<DesktopHome />} />
        <Route path="/explore" element={<DesktopExplore />} />
        <Route path="/explore/:id" element={<DesktopDetail />} />
        <Route path="/map" element={<DesktopMap />} />
        <Route path="/culture" element={<DesktopCulture />} />
        <Route path="/packing" element={<DesktopPacking />} />
        <Route path="/budget" element={<DesktopBudget />} />
        <Route path="/restaurants" element={<DesktopRestaurants />} />
        <Route path="/blog" element={<DesktopBlog />} />
        <Route path="/planner" element={<ProtectedRoute><DesktopPlanner /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><DesktopBlogDetail /></ProtectedRoute>} />
        <Route path="/post/:id" element={<UserBlogDetail />} />
        <Route path="/trip/:id" element={<ProtectedRoute><SavedTrip /></ProtectedRoute>} />
        <Route path="/write" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><DesktopSaved /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DesktopProfile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </DesktopLayout>
  )
}

function MobileApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<MobileHome />} />
      <Route path="/explore" element={<MobileExplore />} />
      <Route path="/explore/:id" element={<ExploreDetail />} />
      <Route path="/planner" element={<ProtectedRoute><MobilePlanner /></ProtectedRoute>} />
      <Route path="/map" element={<MobileMap />} />
      <Route path="/profile" element={<ProtectedRoute><MobileProfile /></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><MobileProfile /></ProtectedRoute>} />
      <Route path="/blog" element={<MobileBlog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/post/:id" element={<UserBlogDetail />} />
      <Route path="/write" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
      <Route path="/culture" element={<Culture />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default function App() {
  const mobile = useIsMobile()
  return (
    <LangProvider>
      <AuthProvider>
        {mobile ? <MobileApp /> : <DesktopApp />}
      </AuthProvider>
    </LangProvider>
  )
}