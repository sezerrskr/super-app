'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Link } from 'lucide-react'; 


const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Buraya metninizi yazın...</p>',
    // SSR optimizasyonu
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  // Araç Çubuğu Bileşeni
  const Toolbar = () => (
    <div className="flex flex-wrap gap-1 p-2 border rounded-t-lg bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-blue-200 p-1 rounded' : 'p-1 rounded hover:bg-gray-200'}
        title="Kalın"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-blue-200 p-1 rounded' : 'p-1 rounded hover:bg-gray-200'}
        title="İtalik"
      >
        <Italic size={18} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-blue-200 p-1 rounded' : 'p-1 rounded hover:bg-gray-200'}
        title="Üstü Çizili"
      >
        <Strikethrough size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-blue-200 p-1 rounded' : 'p-1 rounded hover:bg-gray-200'}
        title="Madde İşaretli Liste"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 p-1 rounded' : 'p-1 rounded hover:bg-gray-200'}
        title="Başlık 2"
      >
        H2
      </button>
      
      {/* Bağlantı Ekleme Butonu (Daha gelişmiş ayarlar gerektirir) */}
      <button
        onClick={() => editor.chain().focus().toggleLink({ href: 'https://example.com' }).run()}
        className={editor.isActive('link') ? 'bg-blue-200 p-1 rounded' : 'p-1 rounded hover:bg-gray-200'}
        title="Bağlantı"
      >
        <Link size={18} />
      </button>
    </div>
  );

  return (
    <div className="border rounded-lg shadow-md max-w-xl mx-auto">
      <Toolbar /> 
      <EditorContent editor={editor} className="p-4 border-t min-h-[200px] focus:outline-none" />
    </div>
  );
}

export default TiptapEditor;