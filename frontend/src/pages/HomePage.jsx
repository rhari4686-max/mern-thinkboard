import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import NoteCard from '../components/NoteCard'

const HomePage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/notes')
      setNotes(res.data)
      setIsRateLimited(false)
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleNoteDelete = (noteId) => {
    setNotes(notes.filter(note => note._id !== noteId))
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">
            Loading notes...
          </div>
        )}

        {!loading && notes.length === 0 && !isRateLimited && (
          <div className="text-center text-base-content/60 py-10">
            No notes found. Create your first note.
          </div>
        )}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteCard 
                key={note._id} 
                note={note}
                onDelete={handleNoteDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage