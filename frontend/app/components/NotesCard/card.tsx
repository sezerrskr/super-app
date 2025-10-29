import React from 'react';
import Link from 'next/link';

// Bileşenin props alması için arayüz (interface) tanımlaması
interface CardProps {
  title: string;
  content: string; // Bu Tiptap içeriği (HTML string)
  href: string; // Tıklanacak link (örn: /notes/edit/[id])
}

// Basit bir HTML temizleyici (HTML etiketlerini kaldırır)
const stripHtml = (html: string | undefined | null) => {
   // HATA DÜZELTMESİ: html değişkeninin varlığını kontrol et
   if (!html) {
     return '';
   }
   // Sunucu tarafında (Server Component) güvenli çalışması için basit regex
   return html.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ');
};


const Card: React.FC<CardProps> = ({ title, content, href }) => { 
  
  // İçeriği temizle (HTML etiketlerini kaldır)
  // content'in null/undefined olabilme ihtimaline karşı stripHtml'i ona göre çağırıyoruz.
  const plainTextContent = stripHtml(content);

  return (
    // Tüm kartı tıklanabilir bir <a> etiketi yapalım ve stilini güncelleyelim
    <Link 
      href={href} // Dinamik link
      className='block w-full bg-gray-800 rounded-lg p-4 shadow-lg transition-all duration-300 hover:bg-gray-700 hover:shadow-xl hover:-translate-y-1'
    > 
      <div className='p-0 w-full'>
        <h1 className='text-xl font-bold mb-1 text-white truncate'>{title}</h1>
        <div className='w-full h-0.5 bg-white opacity-25 mb-2'></div>
        <p 
          className='text-sm text-gray-300 line-clamp-2' 
        >
          {plainTextContent || "İçerik yok..."}
        </p>
      </div>
    </Link>
  )
}

export default Card;
