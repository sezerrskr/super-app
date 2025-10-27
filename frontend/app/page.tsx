import Image from "next/image";
import Navbar from "./components/Navbar/navbar";
import TiptapEditor from "./components/rich-text-editor/menu-bar";

export default function Home() {
  return (
    <div className="@container">
      <Navbar></Navbar>
      <h1>Merrhaba</h1>
    </div>
  );
}
