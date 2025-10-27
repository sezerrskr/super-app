"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    // UYARILAR GİDERİLDİ: 'relative' kaldırıldı, z-index sözdizimi düzeltildi.
    <div className='nav flex bg-(--main-bg) text-white w-full items-center justify-between p-4 lg:px-10 sticky top-0 z-100'> 
      
      {/* Marka */}
      <div className='Marka font-semibold text-xl'>
        <Link href="/">superApp</Link>
      </div>
      
      {/* 1. Masaüstü Linkleri */}
      <nav className='hidden md:flex gap-6 font-medium text-base'>
        <Link href="/notes" rel="noopener noreferrer" className='hover:text-blue-400 transition duration-300 p-1'>Notes</Link>
        <Link href="https://www.instagram.com/sezerr.skr/" target="_blank" rel="noopener noreferrer" className='hover:text-blue-400 transition duration-300 p-1'>MusicApp</Link>
        <Link href="https://www.instagram.com/sezerr.skr/" target="_blank" rel="noopener noreferrer" className='hover:text-blue-400 transition duration-300 p-1'>Yakında...</Link>
        <Link href="https://www.instagram.com/sezerr.skr/" target="_blank" rel="noopener noreferrer" className='hover:text-blue-400 transition duration-300 p-1'>Yakında...</Link>
      </nav>
      
      {/* 2. Hamburger Butonu */}
      <button 
        className='md:hidden p-2 rounded-md hover:bg-white/10 transition duration-200 focus:outline-none' 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      {/* 3. Mobil Menü Alanı (TEMİZLENDİ) */}
      {/* top-full ile Navbar'ın hemen altına indirilir. */}
      <div className={`md:hidden absolute w-full bg-(--main-bg) border-t border-white/20 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100 py-4 left-0' : 'max-h-0 opacity-0'} z-90 top-full`}> 
        
        <nav className='flex flex-col items-center gap-3 font-medium text-lg'>
            <Link href="/notes"rel="noopener noreferrer" className='block w-full text-center p-2 hover:bg-white/10' onClick={toggleMenu}>Notes</Link>
            <Link href="https://www.instagram.com/sezerr.skr/" target="_blank" rel="noopener noreferrer" className='block w-full text-center p-2 hover:bg-white/10' onClick={toggleMenu}>MusicApp</Link>
            <Link href="https://www.instagram.com/sezerr.skr/" target="_blank" rel="noopener noreferrer" className='block w-full text-center p-2 hover:bg-white/10' onClick={toggleMenu}>Yakında..</Link>
            <Link href="https://www.instagram.com/sezerr.skr/" target="_blank" rel="noopener noreferrer" className='block w-full text-center p-2 hover:bg-white/10' onClick={toggleMenu}>Yakında..</Link>
        </nav>
      </div>

    </div>
  );
};

export default Navbar;