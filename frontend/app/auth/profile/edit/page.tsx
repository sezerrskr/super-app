"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar/navbar';
import { useRouter } from 'next/navigation';

const EditProfilePage = () => {
  // Form state'leri
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Sayfa açıldığında mevcut profil bilgilerini çek
  useEffect(() => {
    const run = async () => {
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (!token) {
          setError('Oturum bulunamadı. Lütfen giriş yapın.');
          setLoading(false);
          return;
        }
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.msg || 'Profil bilgileri alınamadı');
        }
        const data = await res.json();
        // Editöre doldur
        setUsername(data.username || '');
        setEmail(data.email || '');
      } catch (e: any) {
        setError(e.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Kaydet butonu: yalnızca username/email günceller
  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      setError('Oturum bulunamadı. Lütfen giriş yapın.');
      return;
    }
    try {
      setSaving(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Sunucudan gelen anlamlı hata mesajını önceliklendir
        const msg = data.errors?.[0]?.msg || data.msg || 'Güncelleme başarısız';
        throw new Error(msg);
      }

      // Başarılı güncelleme: localStorage'i senkronize et (isteğe bağlı)
      if (data.username) localStorage.setItem('username', data.username);
      setSuccess('Profil güncellendi');
      // İsteğe bağlı: profil sayfasına dön
      // router.push(`/auth/profile/${localStorage.getItem('userId')}`)
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <Navbar />
      <div className='max-w-xl mx-auto px-4 py-10'>
        <h1 className='text-3xl font-semibold mb-6'>Profili Düzenle</h1>

        {loading ? (
          <div className='text-gray-300'>Yükleniyor...</div>
        ) : (
          <div className='bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl'>
            {/* Hata ve başarı mesajları */}
            {error && <div className='mb-4 text-red-400'>{error}</div>}
            {success && <div className='mb-4 text-green-400'>{success}</div>}

            {/* Kullanıcı Adı */}
            <label className='block text-sm text-gray-400 mb-1'>Kullanıcı Adı</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='kullanici_adi'
              className='w-full mb-4 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />

            {/* E-posta */}
            <label className='block text-sm text-gray-400 mb-1'>E‑posta</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='ornek@mail.com'
              className='w-full mb-6 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />

            <div className='flex items-center gap-3'>
              <button
                onClick={handleSave}
                disabled={saving}
                className='bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-60'
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                onClick={() => router.back()}
                className='bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg'
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;


