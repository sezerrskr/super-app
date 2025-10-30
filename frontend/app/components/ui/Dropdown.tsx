"use client";
import React, { useEffect, useRef, useState } from 'react';

// Basit ve tekrar kullanılabilir Dropdown bileşeni
// - trigger: Menü aç/kapa düğmesi (React node)
// - children: Menü içeriği (linkler, butonlar vs.)
// - align: menünün hizası (left/right)
// - className: kap (wrapper) stilleri

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'right', className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600"
      >
        {trigger}
      </button>

      {open && (
        <div
          className={`absolute mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// DropdownItem: Tek tek menü elemanı (link veya buton)
interface DropdownItemProps {
  as?: 'button' | 'a';
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ as = 'button', href, onClick, className = '', children }) => {
  const base = `block w-full text-left px-4 py-2 hover:bg-gray-700`;
  if (as === 'a' && href) {
    return (
      <a href={href} className={`${base} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`${base} ${className}`}>
      {children}
    </button>
  );
};

export default Dropdown;


