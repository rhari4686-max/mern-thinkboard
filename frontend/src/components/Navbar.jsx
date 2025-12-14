import { Plus } from 'lucide-react'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isCreatePage = location.pathname === '/create'

  return (
    <nav className="bg-base-100 border-b border-base-300 px-4 py-3 sticky top-0 z-50 backdrop-blur-lg bg-base-100/80">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
        >
          ThinkBoard
        </h1>
        
        {!isCreatePage && (
          <button 
            onClick={() => navigate('/create')}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar