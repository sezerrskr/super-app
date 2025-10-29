import React from 'react'
import Navbar from '../components/Navbar/navbar'
import Card from '../components/NotesCard/card'
import Link from 'next/link'

const page = () => {

  const hardcodedNotes = [
    { _id: '1', title: 'İlk Tiptap Notum', content: '<p>Bu içerik, <b>Tiptap</b> editöründen geldi.</p>' },
    { _id: '2', title: 'Alışveriş Listesi', content: '<ul><li>Süt</li><li>Ekmek</li><li>Yumurta</li></ul>' },
    { _id: '3', title: 'Ders Notları', content: '<b>Önemli:</b> TYT ÇALIŞ' },
    { _id: '4', title: 'Fikirler', content: '<p>Yeni bir mobil uygulama fikri: Local Spotify</p>' },
    { _id: '5', title: 'Kitap Özetleri', content: '<p>Beyaz Geceler: Bu adam aynı ben</p>' },
    { _id: '6', title: 'Yapılacaklar', content: '<ol><li>API entegrasyonunu bitir</li><li>Frontend testlerini yap</li></ol>' },
  ];

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


        <div className='grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 mt-8'>
          {hardcodedNotes.map(note => (
            <Card 
              key={note._id} 
              title={note.title} 
              content={note.content}
              href={`/notes/edit/${note._id}`} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page
