'use client';

import React, { useState } from 'react';

interface RegisterFormState {
    username: string;
    email: string;
    password: string;
}

const RegisterPage = () => {
    // 1. Form state'ini tanımlama
    const [formData, setFormData] = useState<RegisterFormState>({
        username: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // 2. Input değişimlerini yakalama
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 3. Form gönderimini ele alma (İleride backend'e bağlanacak)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        console.log('Kayıt İşlemi Başlatılıyor:', formData);

        // TODO: BURAYA BACKEND API ÇAĞRISI EKLENECEK
        // try {
        //     const response = await api.register(formData);
        //     // Başarılı olursa yönlendirme yap (örn: /login)
        // } catch (err) {
        //     setError('Kayıt başarısız. Lütfen bilgileri kontrol edin veya farklı bir e-posta kullanın.');
        // } finally {
        //     setLoading(false);
        // }

        setLoading(false);
    };

    return (
        // min-h-screen ve ortalama ayarları ana div'de
        <div className='flex items-center justify-center min-h-screen bg-gray-900 p-4'>

            {/* Form Kartı */}
            <div className='w-full sm:w-[400px] bg-gray-800 p-8 rounded-xl shadow-2xl transition-all duration-300'>

                {/* Başlık */}
                <div className='text-center mb-8'>
                    <h1 className='text-white text-3xl font-extrabold tracking-tight'>
                        Yeni Hesap Oluşturun
                    </h1>
                    {error && (
                        <p className="mt-4 text-sm text-red-400 font-medium">
                            {error}
                        </p>
                    )}
                </div>

                {/* Form */}
                <form className='space-y-6' onSubmit={handleSubmit}>

                    {/* Kullanıcı Adı Alanı */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            placeholder="kullanıcı_adı"
                        />
                    </div>

                    {/* E-posta Alanı */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            E-posta
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            placeholder="ornek@mail.com"
                        />
                    </div>

                    {/* Parola Alanı */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Parola
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            placeholder="En az 6 karakter"
                        />
                    </div>

                    {/* Kayıt Ol Butonu */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150 ease-in-out"
                    >
                        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>
                </form>

                <div className='mt-6 text-center text-sm'>
                    <a
                        href="/auth/login"
                        className='font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150 block'
                    >
                        Zaten bir hesabınız var mı? Giriş Yapın.
                    </a>
                    <a
                        href="/"
                        className='font-medium text-gray-400 hover:text-gray-300 transition-colors duration-150 block'
                    >
                        Ana sayfaya dön
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
