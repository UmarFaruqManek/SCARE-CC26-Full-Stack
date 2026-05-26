import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import navbar from "../../assets/navbar.png";

export default function Navbar() {
  const location = useLocation();

  // Fungsi kecil untuk mengecek apakah link sedang aktif
  const isActive = (path) => location.pathname === path;

  return (
    // Efek Glassmorphism: bg-white/90 backdrop-blur-md dan sticky top-0
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Bagian Kiri: Logo & Nama Aplikasi */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={navbar} 
              alt="SCARE Logo" 
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Bagian Kanan: Menu Navigasi */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-300 relative py-2 ${
                isActive("/") 
                  ? "text-[#00687B]" 
                  : "text-gray-500 hover:text-[#00687B]"
              }`}
            >
              Home
              {/* Garis indikator di bawah teks jika aktif */}
              {isActive("/") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4DC9E5] rounded-full"></span>
              )}
            </Link>

            
            <Link
              to="/analysis"
              className="ml-2 hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all bg-[#00687B] rounded-full hover:bg-[#4DC9E5] hover:shadow-md active:scale-95"
            >
              Try Now
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}