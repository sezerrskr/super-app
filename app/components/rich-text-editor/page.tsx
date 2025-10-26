// page.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './menu-bar'; 
import './styles.css'; 

const TiptapPage = () => {
  const editor = useEditor({
    // StarterKit, temel metin biçimlendirme özelliklerinin çoğunu içerir
    extensions: [
      StarterKit.configure({
        // Gerekirse buradan özellikleri açıp kapatabilirsiniz
        // Örneğin, codeBlock: false
      }),
    ],
    // Editörün başlangıç içeriği
    content: `
      <h2>
        Merhaba, Tiptap Editör'e hoş geldiniz!
      </h2>
      <p>
        Bu, <b>kalın</b>, <i>italik</i> ve <code>kod</code> içeren temel bir metin düzenleyicidir.
      </p>
      <ul>
        <li>Liste öğesi 1</li>
        <li>Liste öğesi 2</li>
      </ul>
    `,
    // SSR ortamlarında (Next.js gibi) ilk render sorunlarını önler
    immediatelyRender: false, 
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