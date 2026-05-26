import React from "react";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full py-20 px-4 flex flex-col items-center justify-center min-h-[75vh] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#00BEE1] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none -z-10"></div>

      <div className="text-center relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-[120px] md:text-[180px] font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#4DC9E5] to-[#00687B] mb-2 drop-shadow-sm">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Page Not Found
        </h2>

        <p className="text-[#545454] text-lg mb-12 leading-relaxed max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable. Let's get you back on track.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#4DC9E5] to-[#00687B] hover:brightness-110 text-white font-medium py-4 px-10 text-lg rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <FiHome className="w-6 h-6" />
          Back to Homepage
        </button>
      </div>
    </div>
  );
}
