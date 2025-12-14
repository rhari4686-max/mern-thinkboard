import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { ArrowLeft } from 'lucide-react'

const CreatePage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)

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

    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5001/api/notes', formData)
      toast.success('Note created successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error creating note:', error)
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment.')
      } else {
        toast.error('Failed to create note')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-ghost gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Notes
        </button>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-6 text-primary">
              Create New Note
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Note Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter note title..."
                  className="input input-bordered input-primary w-full"
                  disabled={loading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Content</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered textarea-primary w-full h-64"
                  disabled={loading}
                />
              </div>

              <div className="card-actions justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-8"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Note'
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

export default CreatePage