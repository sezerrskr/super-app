// page.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './menu-bar'; 
import './styles.css'; 

type EditorProps = {
  onChange?: (html: string) => void;
  initialContent?: string;
};

const TiptapPage = ({ onChange, initialContent }: EditorProps) => {
  const editor = useEditor({
    // StarterKit, temel metin biçimlendirme özelliklerinin çoğunu içerir
    extensions: [
      StarterKit.configure({
        // Gerekirse buradan özellikleri açıp kapatabilirsiniz
        // Örneğin, codeBlock: false
      }),
    ],
    // Editörün başlangıç içeriği
    content: initialContent || '',
    // SSR ortamlarında (Next.js gibi) ilk render sorunlarını önler
    immediatelyRender: false, 
    onUpdate({ editor }) {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  return (
    <div className="tiptap-wrapper">
      {/* editor nesnesini MenuBar bileşenine prop olarak iletiyoruz.
        Butonlar bu nesne sayesinde editöre komut gönderebilecek.
      */}
      <MenuBar editor={editor} />
      
      {/* editor nesnesini EditorContent'e iletiyoruz.
        Burası, kullanıcının metni yazdığı alandır.
      */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapPage;