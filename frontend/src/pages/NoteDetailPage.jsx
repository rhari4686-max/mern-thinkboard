import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { ArrowLeft, Trash2 } from 'lucide-react'

const NoteDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/notes/${id}`)
        setNote(res.data)
        setFormData({
          title: res.data.title,
          content: res.data.content
        })
      } catch (error) {
        console.error('Error fetching note:', error)
        toast.error('Failed to load note')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [id, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all fields')
      return
    }

    setSaving(true)
    try {
      await axios.put(`http://localhost:5001/api/notes/${id}`, formData)
      toast.success('Note updated successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`http://localhost:5001/api/notes/${id}`)
        toast.success('Note deleted successfully!')
        navigate('/')
      } catch (error) {
        console.error('Error deleting note:', error)
        toast.error('Failed to delete note')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6 mt-8">
        {/* Header with Back and Delete buttons */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-ghost gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Notes
          </button>

          <button 
            onClick={handleDelete}
            className="btn btn-error gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete Note
          </button>
        </div>

        {/* Main Card */}
        <div className="card bg-base-100 shadow-xl border-t-4 border-[#00FF9D]">
          <div className="card-body">
            <h2 className="text-4xl font-bold text-center mb-8 text-primary flex items-center justify-center gap-3">
              NOTE DETAIL PAGE ✨
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-semibold">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input input-bordered bg-base-200 w-full text-base"
                  disabled={saving}
                />
              </div>

              {/* Content Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-semibold">Content</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="textarea textarea-bordered bg-base-200 w-full h-48 text-base leading-relaxed"
                  disabled={saving}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-wide"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailPage