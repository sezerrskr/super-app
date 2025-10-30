"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/navbar'
import Card from '../components/NotesCard/card'
import Link from 'next/link'

type Note = { _id: string; title: string; content: string }

const page = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
        if (!token) {
          setError('Oturum bulunamadı. Lütfen giriş yapın.')
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/notes`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.msg || 'Notlar getirilemedi')
        }

        const data: Note[] = await res.json()
        setNotes(data)
      } catch (err: any) {
        setError(err.message || 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu notu silmek istediğinize emin misiniz?')) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    if (!token) {
      setError('Oturum bulunamadı. Lütfen giriş yapın.')
      return
    }
    try {
      setDeletingId(id)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.msg || 'Not silinemedi')
      }
      setNotes((prev) => prev.filter((n) => n._id !== id))
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
        
        {/* Başlık ve Buton Alanı */}
        <div className='top-menu flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-medium'>My Notes</h1>
          <Link
            href="notes/addnote" 
            className='bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-white font-semibold cursor-pointer transition-colors duration-300 shadow-md'
          >
            Not Ekle
          </Link>
        </div>

        {loading ? (
          <div className='text-gray-300'>Notlar yükleniyor...</div>
        ) : error ? (
          <div className='text-red-400'>{error}</div>
        ) : (
          <div className='grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 mt-8'>
            {notes.length === 0 ? (
              <div className='col-span-3 text-gray-400'>Henüz notunuz yok.</div>
            ) : (
              notes.map(note => (
                <Card 
                  key={note._id}
                  title={note.title} 
                  content={note.content}
                  href={`/notes/${note._id}`}
                  editHref={`/notes/edit/${note._id}`}
                  onDelete={() => handleDelete(note._id)}
                  deleting={deletingId === note._id}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default page
