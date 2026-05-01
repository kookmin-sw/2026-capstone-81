import { Bell, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
      <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
        <Menu size={20} className="text-gray-700" />
      </button>

      <button onClick={() => navigate('/home')} className="flex items-center gap-1.5">
        <span className="text-lg">✈️</span>
        <span className="font-black text-gray-900 text-base tracking-tight">
          NOMAD<span className="text-primary">AI</span>
        </span>
      </button>

      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors relative">
        <Bell size={18} className="text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>
    </header>
  )
}
