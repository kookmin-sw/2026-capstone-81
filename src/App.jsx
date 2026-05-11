import { Routes, Route, Navigate } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import UserBlogDetail from './pages/UserBlogDetail'
import WriteBlog from './pages/WriteBlog'
import AIChat from './pages/AIChat'

// Desktop pages
import DesktopNav from './components/desktop/DesktopNav'
import ChatWidget from './components/desktop/ChatWidget'
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

function DesktopApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopNav />
      <ChatWidget />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        {/* 공개 페이지 */}
        <Route path="/home" element={<DesktopHome />} />
        <Route path="/explore" element={<DesktopExplore />} />
        <Route path="/explore/:id" element={<DesktopDetail />} />
        <Route path="/map" element={<DesktopMap />} />
        <Route path="/culture" element={<DesktopCulture />} />
        <Route path="/budget" element={<DesktopBudget />} />
        <Route path="/restaurants" element={<DesktopRestaurants />} />
        <Route path="/blog" element={<DesktopBlog />} />
        {/* 로그인 필요 */}
        <Route path="/planner" element={<ProtectedRoute><DesktopPlanner /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><DesktopBlogDetail /></ProtectedRoute>} />
        <Route path="/post/:id" element={<UserBlogDetail />} />
        <Route path="/write" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><DesktopSaved /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DesktopProfile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <DesktopApp />
      </AuthProvider>
    </LangProvider>
  )
}
