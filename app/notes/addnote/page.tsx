import React from "react";
import Navbar from "@/app/components/Navbar/navbar";
import Tiptap from "@/app/components/rich-text-editor/page";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "next/link";
import TiptapEditor from "@/app/components/rich-text-editor/menu-bar";

const page = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="top-menu flex justify-end px-4 mt-10 ">
        <div className="bg-(--main-bg) px-6 py-1 rounded-full text-white cursor-pointer">
          <Link href="notes/addnote">Gönder Gitsin</Link>
        </div>
      </div>
      <div className="max-w-5xl max-md:max-w-xl max-sm:max-w-sm mx-auto py-8">
        <TiptapEditor></TiptapEditor>
        <Tiptap></Tiptap>
      </div>
    </div>
  );
};

export default page;
