'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit, // Temel metin özellikleri burada!
    ],
    content: '<p>Merhaba, bu temel metin düzenleme ile oluşturuldu!</p>',
    // SSR sorunlarını önlemek için
    immediatelyRender: false, 
  })

  return <EditorContent editor={editor} />
}

export default Tiptap