"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar/navbar";
import DOMPurify from 'dompurify';
import Link from "next/link";

type Note = { _id: string; title: string; content: string };

const ReadNotePage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchNote = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (!token) {
          setError('Oturum bulunamadı. Lütfen giriş yapın.');
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.msg || 'Not getirilemedi');
        }

        const data: Note = await res.json();
        setNote(data);
      } catch (err: any) {
        setError(err.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-medium'>Notu Görüntüle</h1>
          <div className='flex items-center gap-4'>
            {note && (
              <Link href={`/notes/edit/${note._id}`} className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg'>Düzenle</Link>
            )}
            <Link href="/notes" className='text-blue-400 hover:text-blue-300'>← Notlara dön</Link>
          </div>
        </div>

        {loading ? (
          <div className='text-gray-300'>Yükleniyor...</div>
        ) : error ? (
          <div className='text-red-400'>{error}</div>
        ) : note ? (
          <article className='bg-gray-800 rounded-lg p-6 shadow-lg'>
            <h2 className='text-2xl font-semibold mb-4'>{note.title}</h2>
            <div
              className='prose prose-invert max-w-none'
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content || '') }}
            />
          </article>
        ) : (
          <div className='text-gray-400'>Not bulunamadı.</div>
        )}
      </div>
    </div>
  );
};

export default ReadNotePage;


