import React from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  content: string; 
  href: string; 
  editHref?: string;
  onDelete?: () => void; // Silme aksiyonu
  deleting?: boolean; // Silme durumunu göstermek için
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


const Card: React.FC<CardProps> = ({ title, content, href, editHref, onDelete, deleting }) => { 
  
  const plainTextContent = stripHtml(content);

  return (
    <div className='w-full bg-gray-800 rounded-lg p-4 shadow-lg transition-all duration-300 hover:bg-gray-700 hover:shadow-xl hover:-translate-y-1'>
      <Link href={href} className='block'>
        <div className='p-0 w-full'>
          <h1 className='text-xl font-bold mb-1 text-white truncate'>{title}</h1>
          <div className='w-full h-0.5 bg-white opacity-25 mb-2'></div>
          <p className='text-sm text-gray-300 line-clamp-2'>
            {plainTextContent || "İçerik yok..."}
          </p>
        </div>
      </Link>
      {(editHref || onDelete) && (
        <div className='mt-3 flex items-center gap-2'>
          {editHref && (
            <Link href={editHref} className='bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm'>Düzenle</Link>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={!!deleting}
              className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md cursor-pointer text-sm disabled:opacity-60'
            >
              {deleting ? 'Siliniyor...' : 'Sil'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Card;
