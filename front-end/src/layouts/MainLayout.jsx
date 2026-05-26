import React from "react";
import { Outlet } from "react-router-dom"; 
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
// import Navbar dari file Anda jika ada

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F5FAFC]">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}