import { Routes, Route, Navigate } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import { useIsMobile } from './hooks/useViewport'

// Mobile pages
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ExploreDetail from './pages/ExploreDetail'
import AIPlanner from './pages/AIPlanner'
import AIChat from './pages/AIChat'
import { BlogList, BlogDetail } from './pages/Blog'
import Culture from './pages/Culture'
import Budget from './pages/Budget'
import Profile from './pages/Profile'
import MapPage from './pages/MapPage'
import Restaurants from './pages/Restaurants'

// Desktop pages
import DesktopNav from './components/desktop/DesktopNav'
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

function MobileApp() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
      <div className="w-full max-w-sm h-[844px] bg-white rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col border border-gray-300" style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.3) inset' }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-white flex-shrink-0 z-50">
          <span className="text-xs font-semibold text-gray-900">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs">▲▲▲</span>
            <span className="text-xs">WiFi</span>
            <span className="text-xs">🔋</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:id" element={<ExploreDetail />} />
            <Route path="/planner" element={<AIPlanner />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function DesktopApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<DesktopHome />} />
        <Route path="/explore" element={<DesktopExplore />} />
        <Route path="/explore/:id" element={<DesktopDetail />} />
        <Route path="/map" element={<DesktopMap />} />
        <Route path="/planner" element={<DesktopPlanner />} />
        <Route path="/blog" element={<DesktopBlog />} />
        <Route path="/blog/:id" element={<DesktopBlogDetail />} />
        <Route path="/profile" element={<DesktopProfile />} />
        <Route path="/culture" element={<DesktopCulture />} />
        <Route path="/budget" element={<DesktopBudget />} />
        <Route path="/restaurants" element={<DesktopRestaurants />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  const isMobile = useIsMobile()

  return (
    <LangProvider>
      {isMobile ? <MobileApp /> : <DesktopApp />}
    </LangProvider>
  )
}
