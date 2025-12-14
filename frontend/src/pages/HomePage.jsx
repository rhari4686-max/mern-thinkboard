import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import NoteCard from '../components/NoteCard';
import ErrorToast from '../components/ErrorToast';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/notes');
      
      // Ensure we always set an array
      const notesData = Array.isArray(res.data) ? res.data : [];
      console.log('Fetched notes:', notesData);
      setNotes(notesData);
      
      setIsRateLimited(false);
    } catch (error) {
      console.error('Fetch notes error:', error);
      if (error.response?.status === 429) {
        setIsRateLimited(true);
      } else {
        setError(error.message || 'Failed to load notes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();

    // Listen for note creation events
    const handleNoteCreated = () => {
      console.log('Note created event received');
      fetchNotes();
    };

    window.addEventListener('noteCreated', handleNoteCreated);
    
    return () => {
      window.removeEventListener('noteCreated', handleNoteCreated);
    };
  }, []);

  const handleNoteDelete = (noteId) => {
    setNotes(notes.filter(note => note._id !== noteId));
  };

  const handleRetry = () => {
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      {error && (
        <ErrorToast 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/60">Loading notes...</p>
          </div>
        )}

        {!loading && error && !isRateLimited && (
          <div className="text-center py-10">
            <div className="alert alert-error max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={handleRetry} className="btn btn-primary mt-4">
              Retry
            </button>
          </div>
        )}

        {!loading && notes.length === 0 && !isRateLimited && !error && (
          <div className="text-center py-10">
            <p className="text-base-content/60 mb-4">No notes found. Create your first note.</p>
            <button onClick={() => navigate('/create')} className="btn btn-primary">
              Create Note
            </button>
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
  );
};

export default HomePage;
