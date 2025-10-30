"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar/navbar";
import dynamic from 'next/dynamic';
const TiptapFullEditor = dynamic(() => import("@/app/components/rich-text-editor/page"), { ssr: false });
import Link from "next/link";

type Note = { _id: string; title: string; content: string };

const EditNotePage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setTitle(data.title);
        setContent(data.content);
      } catch (e: any) {
        setError(e.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Başlık gereklidir');
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      setError('Oturum bulunamadı. Lütfen giriş yapın.');
      return;
    }
    try {
      setSaving(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.msg || 'Not güncellenemedi');
      }
      window.location.href = `/notes/${id}`;
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-900 w-full min-h-screen text-gray-100"> 
      <Navbar />
      <div className="top-menu flex justify-between items-center gap-4 px-4 mt-10 max-w-7xl mx-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlık"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className='flex items-center gap-3'>
          <button
            onClick={handleSave}
            disabled={saving}
            className='bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-60'
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <Link href={`/notes/${id}`} className='text-blue-400 hover:text-blue-300'>Vazgeç</Link>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 mt-6 text-gray-300">Yükleniyor...</div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4 mt-6 text-red-400">{error}</div>
      ) : (
        <div className="max-w-6xl max-md:px-4 mx-auto py-12">
          <TiptapFullEditor onChange={setContent} initialContent={content} />
        </div>
      )}
    </div>
  );
};

export default EditNotePage;


