"use client";
import React, { useEffect, useState } from 'react'
import Navbar from '@/app/components/Navbar/navbar'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const ProfilePage = () => {
  // URL'den dinamik parametreyi alıyoruz (örn: /auth/profile/sezer)
  const params = useParams();
  const routeId = params?.id as string; // Bu örnekte kullanıcı adı olarak kullanacağız

  // Local state: ekranda göstereceğimiz kullanıcı adı
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (!token) {
          setError('Oturum bulunamadı.');
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
          throw new Error(data.msg || 'Profil alınamadı');
        }
        const data = await res.json();
        // Sunucu: { id, username, email }
        setUsername(data.username || null);
        setEmail(data.email || null);
        const meId = data.id;
        // Yalnızca kendi profiline izin ver
        if (meId && String(meId) === String(routeId)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (e: any) {
        setError(e.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [routeId]);

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      {/* Üst menü */}
      <Navbar />

      {/* İçerik alanı */}
      <div className='max-w-3xl mx-auto px-4 py-10'>
        {/* Başlık alanı */}
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-3xl font-semibold'>Profil</h1>
        </div>

        {/* Kart görünümü */}
        <div className='bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl'>
          {/* Yükleme ve yetki kontrolü */}
          {loading ? (
            <div className='text-gray-300'>Yükleniyor...</div>
          ) : error ? (
            <div className='text-red-400'>{error}</div>
          ) : !authorized ? (
            <div className='text-red-400'>Bu profili görüntüleme yetkiniz yok.</div>
          ) : (
          <>
          {/* Temel bilgiler */}
          <div className='space-y-2'>
            {/* routeId: URL'deki id; username/email sunucudan */}
            <p className='text-sm text-gray-400'>Kullanıcı ID</p>
            <p className='text-xl break-all'>{routeId}</p>

            <div className='h-px bg-gray-700 my-4' />

            <p className='text-sm text-gray-400'>Kullanıcı Adı</p>
            <p className='text-xl'>{username ? `@${username}` : 'Bilinmiyor'}</p>

            <div className='h-px bg-gray-700 my-4' />

            <p className='text-sm text-gray-400'>E-posta</p>
            <p className='text-xl'>{email || 'Bilinmiyor'}</p>
          </div>

          {/* Aksiyon butonları: düzenleme ve notlara git */}
          <div className='mt-6 flex gap-3'>
            {/* Örnek butonlar - henüz fonksiyon eklemedik */}
            <a href={`/auth/profile/edit/`} className='bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg'>Profili Düzenle</a>
            <button className='bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg'>Şifreyi Değiştir</button>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage