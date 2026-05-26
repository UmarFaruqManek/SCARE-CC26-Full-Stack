import React from "react";
import { FiHome, FiRefreshCcw, FiServer, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="w-full py-20 px-4 flex flex-col items-center justify-center min-h-[75vh] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-400 rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none -z-10"></div>
      <div className="text-center relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <div className="mb-6 text-[#00687B] relative inline-flex items-center justify-center">
          <FiServer className="w-24 h-24 stroke-[1.5]" />

          <div className="absolute -bottom-1 -right-3 text-red-500">
            <FiX className="w-10 h-10 stroke-[4] drop-shadow-md" />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold leading-none tracking-tight text-gray-900 mb-4 drop-shadow-sm">
          500
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-[#00687B] mb-5">
          AI Engine Temporarily Unavailable
        </h2>

        <p className="text-[#545454] text-lg mb-10 leading-relaxed max-w-lg mx-auto">
          Our analysis servers are currently experiencing a high volume of
          requests or undergoing routine maintenance. We apologize for the wait.
          Please try your analysis again in a few moments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => navigate("/analysis")}
            className="flex items-center justify-center gap-2.5 bg-white border-2 border-gray-200 text-[#545454] hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 font-medium py-4 px-8 text-lg rounded-2xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <FiRefreshCcw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#4DC9E5] to-[#00687B] hover:brightness-110 text-white font-medium py-4 px-8 text-lg rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <FiHome className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
