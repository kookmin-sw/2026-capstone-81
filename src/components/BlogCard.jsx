import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function BlogCard({ blog }) {
  const navigate = useNavigate()
  const { lang } = useLang()

  return (
    <div
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100/80 cursor-pointer active:scale-[0.98] transition-all"
      onClick={() => navigate(`/blog/${blog.id}`)}
    >
      <div className="relative h-28">
        <img src={blog.image} alt={blog.title[lang]} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {blog.category[lang]}
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-1.5">
          {blog.title[lang]}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">{blog.date}</span>
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
            <Heart size={9} className="fill-red-400 text-red-400" />
            {blog.likes}
          </span>
        </div>
      </div>
    </div>
  )
}
