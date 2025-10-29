import React from "react";
import Navbar from "@/app/components/Navbar/navbar";
import TiptapFullEditor from "@/app/components/rich-text-editor/page";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="bg-gray-900 w-full min-h-screen text-gray-100"> 
      <Navbar />
      
      <div className="top-menu flex justify-end px-4 mt-10 max-w-7xl mx-auto">
        <Link 
          href="notes/addnote"
          className='bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-full text-white font-bold text-lg tracking-wide cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
        >
          📝 Not Ekle
        </Link>
      </div>
      
      <div className="max-w-6xl max-md:px-4 mx-auto py-12">
        <TiptapFullEditor />
      </div>
    </div>
  );
};

export default HomePage;