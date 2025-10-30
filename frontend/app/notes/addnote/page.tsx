"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Navbar/navbar";
import dynamic from 'next/dynamic';
const TiptapFullEditor = dynamic(() => import("@/app/components/rich-text-editor/page"), { ssr: false });
import Link from "next/link";

const HomePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError("Başlık gereklidir");
      return;
    }
    if (!content || content === "<p></p>") {
      setError("İçerik boş olamaz");
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      setError("Oturum bulunamadı. Lütfen giriş yapın.");
      return;
    }
    try {
      setSaving(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.[0]?.msg || data.msg || 'Not kaydedilemedi');
      }
      window.location.href = '/notes';
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
        <button
          onClick={handleSave}
          disabled={saving}
          className='bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-full text-white font-bold text-lg tracking-wide cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-60'
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4 text-red-400">{error}</div>
      )}

      <div className="max-w-6xl max-md:px-4 mx-auto py-12">
        <TiptapFullEditor onChange={setContent} initialContent="" />
      </div>
    </div>
  );
};

export default HomePage;