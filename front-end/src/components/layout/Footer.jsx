import React from "react";
import scarLogo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F0F4F6] border-t border-gray-100 px-6 py-6 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-6 mb-5">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">SCARE</span>
            <span className="text-xs text-gray-500">
              Scar Classification and Recognition Engine
            </span>
          </div>
          {scarLogo ? (

            <img
              src={scarLogo}
              alt="SCARE Logo"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          ) : (
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xs">
              Logo
            </div>
          )}
        </div>

        <div className="border-t border-[#cccccc] pt-4">
          <p className="text-xs text-gray-400">
            © 2026 SCARE. Medical AI for clinical professionals.
          </p>
        </div>
        
      </div>
    </footer>
  );
}