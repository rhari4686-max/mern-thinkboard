import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PenSquare, Trash2 } from 'lucide-react'
import { formatDate } from '../lib/utils.js'
import axios from 'axios'
import toast from 'react-hot-toast'

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate()

  const handleEdit = (e) => {
    e.preventDefault() // Prevent Link navigation
    e.stopPropagation()
    navigate(`/note/${note._id}`)
  }

  const handleDelete = async (e) => {
    e.preventDefault() // Prevent Link navigation
    e.stopPropagation()
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`http://localhost:5001/api/notes/${note._id}`)
        toast.success('Note deleted successfully!')
        // Refresh the page or call parent's refresh function
        if (onDelete) {
          onDelete(note._id)
        } else {
          window.location.reload()
        }
      } catch (error) {
        console.error('Error deleting note:', error)
        toast.error('Failed to delete note')
      }
    }
  }

  const handleCardClick = () => {
    navigate(`/note/${note._id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 cursor-pointer
                 border-t-4 border-solid border-[#00FF9D]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">
          {note.title}
        </h3>

        <p className="text-base-content/70 line-clamp-3">
          {note.content}
        </p>

        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(note.createdAt)}
          </span>

          <div className="flex items-center gap-1">
            <button 
              onClick={handleEdit}
              className="btn btn-ghost btn-xs hover:bg-primary/20"
            >
              <PenSquare className="w-4 h-4" />
            </button>

            <button 
              onClick={handleDelete}
              className="btn btn-ghost btn-xs text-error hover:bg-error/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteCard