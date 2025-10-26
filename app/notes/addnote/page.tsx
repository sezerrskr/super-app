import React from "react";
import Navbar from "@/app/components/Navbar/navbar";
import TiptapFullEditor from "@/app/components/rich-text-editor/page";
import Link from "next/link";
const HomePage = () => {

  
  return (
    <div>
      <Navbar />
      <div className="top-menu flex justify-end px-4 mt-10">
        <div className="bg-(--main-bg) px-6 py-1 rounded-full text-white cursor-pointer">
          <Link href="notes/addnote">Gönder Gitsin</Link>
        </div>
      </div>
      <div className="max-w-5xl max-md:max-w-xl max-sm:max-w-sm mx-auto py-8">
        <TiptapFullEditor />
      </div>
    </div>
  );
};

export default HomePage;